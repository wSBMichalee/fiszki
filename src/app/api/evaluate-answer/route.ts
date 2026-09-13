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

    const { question, expectedAnswer, transcript } = await req.json()

    if (!question || !transcript) {
      return NextResponse.json({ error: 'Brak wymaganych danych wejściowych' }, { status: 400 })
    }

    const promptText = `
Zadanie: Jesteś egzaminatorem ustnym. Oceniaj odpowiedź ucznia (transkrypcję z mowy).
Pytanie: ${question}
Wzorcowa (oczekiwana) odpowiedź: ${expectedAnswer}
Odpowiedź udzielona przez ucznia: ${transcript}

Zasady oceny:
1. Skup się wyłącznie na merytoryce. Ignoruj ewentualne zająknięcia, literówki z transkrypcji mowy (Speech-to-Text), czy potoczny język, jeśli sens merytoryczny jest prawidłowy.
2. Odpowiedź jest "wystarczająca" (isSufficient: true), jeśli zawiera kluczowe elementy odpowiedzi wzorcowej, nawet jeśli są opowiedziane własnymi słowami.
3. Jeśli odpowiedź nie odpowiada na pytanie lub jest to "nie wiem", oznacz ją jako niewystarczającą (isSufficient: false).

Zwróć WYŁĄCZNIE czysty JSON w następującym formacie:
{
  "isSufficient": boolean,
  "missingElements": "Zwięzły tekst, czego zabrakło w odpowiedzi. Użyj null jeśli jest w pełni poprawna i kompletna.",
  "justification": "Krótkie uzasadnienie twojej decyzji w 1-2 zdaniach."
}
Nie dodawaj żadnego dodatkowego tekstu ani bloków markdown, zwracasz sam JSON.
`

    let response
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: promptText }]
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

    let text = (response.text || '{}').trim()
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
      return NextResponse.json({ error: 'Nie udało się odczytać odpowiedzi od AI' }, { status: 500 })
    }

    return NextResponse.json(parsed)

  } catch (error) {
    console.error('Error in evaluate-answer:', error)
    return NextResponse.json({ error: 'Wystąpił błąd podczas analizy odpowiedzi' }, { status: 500 })
  }
}
