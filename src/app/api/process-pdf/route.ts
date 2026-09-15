import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { inngest } from '@/inngest/client'
import { buildPrompt } from '@/lib/gemini-helpers'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: userData, error: authError } = await supabase.auth.getUser()

    if (authError || !userData?.user) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const { fileUrl, subject, topic } = await req.json()

    if (!fileUrl) {
      return NextResponse.json({ error: 'Brak pliku PDF' }, { status: 400 })
    }

    const promptText = buildPrompt(subject, topic)

    // 1. Utwórz nowy rekord w tabeli decks ze statusem 'pending'
    const { data: deckData, error: deckError } = await supabase
      .from('decks')
      .insert({
        title: subject ? `Nowy zestaw: ${subject}` : 'Nowy zestaw ze skanera',
        subject: subject || null,
        topic: topic || null,
        user_id: userData.user.id,
        processing_status: 'pending'
      })
      .select('id')
      .single()

    if (deckError || !deckData) {
      console.error('Błąd tworzenia zestawu w bazie:', deckError)
      return NextResponse.json({ error: 'Nie udało się zainicjować zestawu fiszek' }, { status: 500 })
    }

    const deckId = deckData.id

    // 2. Wyemituj zdarzenie do Inngesta, by rozpoczął pracę w tle
    const inngestResult = await inngest.send({
      name: 'notes/process.requested',
      data: {
        deckId,
        fileUrl,
        promptText,
        userId: userData.user.id
      }
    })

    // 3. Zwróć natychmiast ID talii do klienta
    return NextResponse.json({ deckId, status: 'processing' })

  } catch (error) {
    console.error('Error in process-pdf:', error)
    return NextResponse.json({ error: 'Wystąpił błąd podczas inicjacji zadania' }, { status: 500 })
  }
}
