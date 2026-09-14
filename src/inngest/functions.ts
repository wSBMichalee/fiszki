import { inngest } from './client'
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@supabase/supabase-js'
import { generateCardsFromGemini } from '@/lib/gemini-helpers'
import { NonRetriableError } from 'inngest'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export const processNotesJob = inngest.createFunction(
  { 
    id: 'process-notes-job', 
    retries: 3,
    triggers: [{ event: 'notes/process.requested' }],
    onFailure: async ({ event, error, step }) => {
      // Inngest przekazuje oryginalne zdarzenie w event.data.event
      const originalEvent = event.data.event
      const deckId = originalEvent.data.deckId

      await step.run('set-error-status', async () => {
        // Musimy stworzyć nową instancję Supabase dla bloku onFailure
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        
        await supabaseAdmin
          .from('decks')
          .update({ 
            processing_status: 'error',
            processing_error: error.message || 'Wystąpił nieznany błąd podczas przetwarzania (po wyczerpaniu wszystkich prób)'
          })
          .eq('id', deckId)
      })
    }
  },
  async ({ event, step }) => {
    const { deckId, fileUrl, imageBase64, promptText, userId } = event.data

    console.log(`Rozpoczynam przetwarzanie talii ${deckId} w tle dla usera ${userId}...`)
    
    await step.run('set-processing-status', async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const { error } = await supabase
        .from('decks')
        .update({ processing_status: 'processing' })
        .eq('id', deckId)
        
      if (error) {
        throw new Error('Nie udało się ustawić statusu na processing')
      }
    })

    const parsedCards = await step.run('process-with-gemini', async () => {
      let mimeType = 'image/jpeg'
      let base64Data = ''

      if (fileUrl) {
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
          const meta = parts[0].replace('data:', '')
          const mime = meta.split(';')[0]
          if (mime) mimeType = mime
        }
      }
      
      try {
        // Nie przekazujemy pętli retry, Inngest ponowi całe zadanie jeśli wystąpi błąd
        // więc ustawiamy maxAttempts = 1 dla lokalnej pętli. Inngest zajmie się resztą.
        return await generateCardsFromGemini(ai, base64Data, mimeType, promptText, 1)
      } catch (err: any) {
        // Błąd parsowania fiszek nie naprawi się po ponownej próbie, omijamy retry
        if (err.message === 'Nie udało się odczytać fiszek') {
          throw new NonRetriableError(err.message)
        }
        throw err // Pozostałe błędy np. przeciążenie API rzucamy dalej (retry)
      }
    })

    await step.run('save-to-supabase', async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      if (!parsedCards || !Array.isArray(parsedCards) || parsedCards.length === 0) {
        throw new NonRetriableError('Wygenerowano pustą listę fiszek')
      }

      const cardsToInsert = parsedCards.map((card: any, index: number) => ({
        deck_id: deckId,
        front: card.question || card.front || '',
        back: card.answer || card.back || '',
        order_index: index,
        user_id: userId // Dodajemy user_id jeśli RLS tabeli cards tego wymaga
      }))

      const { error } = await supabase
        .from('cards')
        .insert(cardsToInsert)

      if (error) {
        console.error('Błąd zapisu kart:', error)
        throw new Error('Nie udało się zapisać fiszek do bazy danych')
      }
    })

    await step.run('update-deck-status', async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { error } = await supabase
        .from('decks')
        .update({ processing_status: 'completed' })
        .eq('id', deckId)

      if (error) {
        throw new Error('Nie udało się zaktualizować statusu talii')
      }
    })

    return { success: true, deckId }
  }
)
