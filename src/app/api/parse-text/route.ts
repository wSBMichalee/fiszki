import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: userData, error: authError } = await supabase.auth.getUser()

    if (authError || !userData?.user) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const { text, subject, topic } = await req.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Brak tekstu do analizy' }, { status: 400 })
    }

    let contextIntro = ''
    if (subject && typeof subject === 'string' && subject.trim().length > 0) {
      contextIntro += `Przedmiot: ${subject.trim()}. `
    }
    if (topic && typeof topic === 'string' && topic.trim().length > 0) {
      contextIntro += `Temat: ${topic.trim()}. `
    }

    const promptText = contextIntro.length > 0
      ? `${contextIntro}Przeanalizuj poniższy tekst z tego przedmiotu i tematu i wyciągnij z niego wszystkie logiczne pary pytanie-odpowiedź do nauki w formie fiszek, używając terminologii właściwej dla tego kontekstu. Zwróć WYŁĄCZNIE czysty JSON w formacie: [{"question": "...", "answer": "..."}, ...]. Nie dodawaj żadnego dodatkowego tekstu ani bloków markdown, zwracasz sam JSON.\n\nTekst:\n${text}`
      : `Przeanalizuj poniższy tekst i wyciągnij z niego wszystkie logiczne pary pytanie-odpowiedź do nauki w formie fiszek. Zwróć WYŁĄCZNIE czysty JSON w formacie: [{"question": "...", "answer": "..."}, ...]. Nie dodawaj żadnego dodatkowego tekstu ani bloków markdown, zwracasz sam JSON.\n\nTekst:\n${text}`

    let response
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: promptText,
          config: {
            responseMimeType: 'application/json',
          }
        })
        break
      } catch (err: unknown) {
        const error = err as { status?: number; code?: number }
        if (attempt === 1 && (error?.status === 503 || error?.code === 503)) {
          console.warn('Gemini 503 spike, retrying in 1.2s...')
          await new Promise(res => setTimeout(res, 1200))
          continue
        }
        throw err
      }
    }

    if (!response) {
      return NextResponse.json({ error: 'Nie udało się uzyskać odpowiedzi od modelu' }, { status: 500 })
    }

    let resultText = (response.text || '[]').trim()
    if (resultText.startsWith('```json')) {
      resultText = resultText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim()
    } else if (resultText.startsWith('```')) {
      resultText = resultText.replace(/^```\s*/, '').replace(/\s*```$/, '').trim()
    }
    
    let parsed
    try {
      parsed = JSON.parse(resultText)
    } catch {
      console.error('Failed to parse Gemini response:', resultText)
      return NextResponse.json({ error: 'Nie udało się odczytać fiszek z tekstu' }, { status: 500 })
    }

    return NextResponse.json({ cards: parsed })

  } catch (error) {
    console.error('Error in parse-text:', error)
    return NextResponse.json({ error: 'Wystąpił błąd podczas analizy tekstu' }, { status: 500 })
  }
}
