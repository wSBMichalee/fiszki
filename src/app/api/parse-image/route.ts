import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'Brak obrazu' }, { status: 400 })
    }

    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/jpeg'
              }
            },
            {
              text: 'Przeanalizuj to zdjęcie notatek/podręcznika i wyciągnij z niego wszystkie logiczne pary pytanie-odpowiedź do nauki w formie fiszek. Zwróć WYŁĄCZNIE czysty JSON w formacie: [{"question": "...", "answer": "..."}, ...]. Nie dodawaj żadnego dodatkowego tekstu ani bloków markdown, zwracasz sam JSON.'
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    })

    const text = response.text || '[]'
    
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch (e) {
      console.error('Failed to parse Gemini response:', text)
      return NextResponse.json({ error: 'Nie udało się odczytać fiszek' }, { status: 500 })
    }

    return NextResponse.json({ cards: parsed })

  } catch (error) {
    console.error('Error in parse-image:', error)
    return NextResponse.json({ error: 'Wystąpił błąd podczas analizy obrazu' }, { status: 500 })
  }
}
