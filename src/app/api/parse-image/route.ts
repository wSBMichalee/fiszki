import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { buildPrompt, generateCardsFromGemini } from '@/lib/gemini-helpers'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export const maxDuration = 280

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

    const promptText = buildPrompt(subject, topic)
    let mimeType = 'image/jpeg'
    let base64Data = imageBase64

    if (imageBase64.includes(',')) {
      const parts = imageBase64.split(',')
      base64Data = parts[1]
      const meta = parts[0].replace('data:', '')
      const mime = meta.split(';')[0]
      if (mime) {
        mimeType = mime
      }
    }

    const parsedCards = await generateCardsFromGemini(ai, base64Data, mimeType, promptText, 2)
    return NextResponse.json({ cards: parsedCards })

  } catch (error: any) {
    console.error('Error in parse-image:', error)
    return NextResponse.json(
      { error: error.message || 'Wystąpił błąd podczas analizy obrazu' }, 
      { status: error.message?.includes('przeciążone') ? 503 : 500 }
    )
  }
}
