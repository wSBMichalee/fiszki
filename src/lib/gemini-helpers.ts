import { GoogleGenAI } from '@google/genai'

export function buildPrompt(subject?: string, topic?: string): string {
  let contextIntro = ''
  if (subject && typeof subject === 'string' && subject.trim().length > 0) {
    contextIntro += `Przedmiot: ${subject.trim()}. `
  }
  if (topic && typeof topic === 'string' && topic.trim().length > 0) {
    contextIntro += `Temat: ${topic.trim()}. `
  }

  return contextIntro.length > 0
    ? `${contextIntro}Przeanalizuj CAŁY ten dokument (zdjęcie lub plik PDF, wszystkie strony bez pomijania żadnej z nich) z tego przedmiotu i tematu i wyciągnij z niego wszystkie logiczne pary pytanie-odpowiedź do nauki w formie fiszek, używając terminologii właściwej dla tego kontekstu. Zwróć WYŁĄCZNIE czysty JSON w formacie: [{"question": "...", "answer": "..."}, ...]. Nie dodawaj żadnego dodatkowego tekstu ani bloków markdown, zwracasz sam JSON.`
    : 'Przeanalizuj CAŁY ten dokument (zdjęcie lub plik PDF, wszystkie strony bez pomijania żadnej z nich) i wyciągnij z niego wszystkie logiczne pary pytanie-odpowiedź do nauki w formie fiszek. Zwróć WYŁĄCZNIE czysty JSON w formacie: [{"question": "...", "answer": "..."}, ...]. Nie dodawaj żadnego dodatkowego tekstu ani bloków markdown, zwracasz sam JSON.'
}

export function parseGeminiResponse(responseText: string): any[] {
  let text = (responseText || '[]').trim()
  if (text.startsWith('```json')) {
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim()
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\s*/, '').replace(/\s*```$/, '').trim()
  }
  
  return JSON.parse(text)
}

export async function generateCardsFromGemini(
  ai: GoogleGenAI,
  base64Data: string,
  mimeType: string,
  promptText: string,
  maxAttempts: number = 2
) {
  let response
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
        throw new Error('Serwery AI są chwilowo przeciążone, spróbuj ponownie za chwilę')
      }
      
      throw err
    }
  }

  if (!response) {
    throw new Error('Nie udało się uzyskać odpowiedzi od modelu')
  }

  try {
    return parseGeminiResponse(response.text || '[]')
  } catch {
    console.error('Failed to parse Gemini response:', response.text)
    throw new Error('Nie udało się odczytać fiszek')
  }
}
