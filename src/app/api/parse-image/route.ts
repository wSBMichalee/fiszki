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

    const { imageBase64, subject, topic } = await req.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'Brak obrazu' }, { status: 400 })
    }

    let contextIntro = ''
    if (subject && typeof subject === 'string' && subject.trim().length > 0) {
      contextIntro += `Przedmiot: ${subject.trim()}. `
    }
    if (topic && typeof topic === 'string' && topic.trim().length > 0) {
      contextIntro += `Temat: ${topic.trim()}. `
    }

    const promptText = contextIntro.length > 0
      ? `${contextIntro}Przeanalizuj to zdjęcie notatek z tego przedmiotu i tematu i wyciągnij z niego wszystkie logiczne pary pytanie-odpowiedź do nauki w formie fiszek, używając terminologii właściwej dla tego kontekstu. Zwróć WYŁĄCZNIE czysty JSON w formacie: [{"question": "...", "answer": "..."}, ...]. Nie dodawaj żadnego dodatkowego tekstu ani bloków markdown, zwracasz sam JSON.`
      : 'Przeanalizuj to zdjęcie notatek/podręcznika i wyciągnij z niego wszystkie logiczne pary pytanie-odpowiedź do nauki w formie fiszek. Zwróć WYŁĄCZNIE czysty JSON w formacie: [{"question": "...", "answer": "..."}, ...]. Nie dodawaj żadnego dodatkowego tekstu ani bloków markdown, zwracasz sam JSON.'

    let mimeType = 'image/jpeg'
    let base64Data = imageBase64
    if (imageBase64.includes(',')) {
      const parts = imageBase64.split(',')
      base64Data = parts[1]
      const match = parts[0].match(/data:(image\/[a-zA-Z0-9+.-]+);base64/)
      if (match) {
        mimeType = match[1]
      }
    }
    
    let response
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    data: base64Data,
                    mimeType
                  }
                },
                {
                  text: promptText
                }
              ]
            }
          ],
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

    let text = (response.text || '[]').trim()
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim()
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/\s*```$/, '').trim()
    }
    
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      console.error('Failed to parse Gemini response:', text)
      return NextResponse.json({ error: 'Nie udało się odczytać fiszek' }, { status: 500 })
    }

    return NextResponse.json({ cards: parsed })

  } catch (error) {
    console.error('Error in parse-image:', error)
    return NextResponse.json({ error: 'Wystąpił błąd podczas analizy obrazu' }, { status: 500 })
  }
}
