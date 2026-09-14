import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export const maxDuration = 280 // Bezpieczny margines przed twardym limitem 300s na planie Pro

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: userData, error: authError } = await supabase.auth.getUser()

    if (authError || !userData?.user) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const { imageBase64, fileUrl, subject, topic } = await req.json()

    if (!imageBase64 && !fileUrl) {
      return NextResponse.json({ error: 'Brak obrazu lub pliku' }, { status: 400 })
    }

    let contextIntro = ''
    if (subject && typeof subject === 'string' && subject.trim().length > 0) {
      contextIntro += `Przedmiot: ${subject.trim()}. `
    }
    if (topic && typeof topic === 'string' && topic.trim().length > 0) {
      contextIntro += `Temat: ${topic.trim()}. `
    }

    const promptText = contextIntro.length > 0
      ? `${contextIntro}Przeanalizuj CAŁY ten dokument (zdjęcie lub plik PDF, wszystkie strony bez pomijania żadnej z nich) z tego przedmiotu i tematu i wyciągnij z niego wszystkie logiczne pary pytanie-odpowiedź do nauki w formie fiszek, używając terminologii właściwej dla tego kontekstu. Zwróć WYŁĄCZNIE czysty JSON w formacie: [{"question": "...", "answer": "..."}, ...]. Nie dodawaj żadnego dodatkowego tekstu ani bloków markdown, zwracasz sam JSON.`
      : 'Przeanalizuj CAŁY ten dokument (zdjęcie lub plik PDF, wszystkie strony bez pomijania żadnej z nich) i wyciągnij z niego wszystkie logiczne pary pytanie-odpowiedź do nauki w formie fiszek. Zwróć WYŁĄCZNIE czysty JSON w formacie: [{"question": "...", "answer": "..."}, ...]. Nie dodawaj żadnego dodatkowego tekstu ani bloków markdown, zwracasz sam JSON.'

    let mimeType = 'image/jpeg'
    let base64Data = ''

    if (fileUrl) {
      // Pobieranie pliku z URL (np. Supabase Storage) i konwersja do Base64
      const fileRes = await fetch(fileUrl)
      if (!fileRes.ok) throw new Error('Nie udało się pobrać pliku źródłowego z Storage')
      
      const arrayBuffer = await fileRes.arrayBuffer()
      base64Data = Buffer.from(arrayBuffer).toString('base64')
      mimeType = fileRes.headers.get('content-type') || 'application/pdf'
    } else if (imageBase64) {
      base64Data = imageBase64
      if (imageBase64.includes(',')) {
        const parts = imageBase64.split(',')
        base64Data = parts[1]
        // Wzorzec data:[<mediatype>][;base64],
        // Bezpieczniejsze wyciąganie mimeType bez rygorystycznego regexu
        const meta = parts[0].replace('data:', '')
        const mime = meta.split(';')[0]
        if (mime) {
          mimeType = mime
        }
      }
    }
    
    let response
    const maxAttempts = 2
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
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
        const isTransientError = error?.status === 503 || error?.code === 503 || error?.status === 429
        
        if (attempt < maxAttempts && isTransientError) {
          console.warn(`Gemini 503/429 spike, retrying in 2000ms (attempt ${attempt}/${maxAttempts})...`)
          await new Promise(res => setTimeout(res, 2000))
          continue
        }
        
        if (attempt === maxAttempts && isTransientError) {
          return NextResponse.json(
            { error: 'Serwery AI są chwilowo przeciążone, spróbuj ponownie za chwilę' }, 
            { status: 503 }
          )
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
