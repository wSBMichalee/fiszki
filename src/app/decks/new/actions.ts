'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveDeck(
  title: string,
  cards: { question: string; answer: string }[],
  subject?: string,
  sourceImageUrls?: string[]
) {
  const supabase = await createClient()
  
  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData.user) throw new Error('Brak autoryzacji')

  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .insert({
      title,
      subject: subject?.trim() || null,
      user_id: userData.user.id,
      source_image_urls: sourceImageUrls || []
    })
    .select()
    .single()

  if (deckError) {
    if (deckError.message?.includes('schema cache') || deckError.code === 'PGRST205') {
      throw new Error('Baza danych wymaga utworzenia tabel (skopiuj zawartość pliku supabase/schema.sql do SQL Editor w panelu Supabase).')
    }
    throw new Error(deckError.message)
  }

  const cardsToInsert = cards.map(c => ({
    deck_id: deck.id,
    question: c.question,
    answer: c.answer
  }))

  const { error: cardsError } = await supabase
    .from('cards')
    .insert(cardsToInsert)

  if (cardsError) throw new Error(cardsError.message)

  revalidatePath('/')
  return deck.id
}

export async function deleteDeck(deckId: string) {
  const supabase = await createClient()
  
  // 1. Authenticate user
  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData.user) throw new Error('Brak autoryzacji')

  // 2. Fetch deck to verify ownership and get image URLs
  const { data: deck, error: fetchError } = await supabase
    .from('decks')
    .select('user_id, source_image_urls')
    .eq('id', deckId)
    .single()

  if (fetchError || !deck) {
    throw new Error('Zestaw nie istnieje lub brak dostępu.')
  }

  if (deck.user_id !== userData.user.id) {
    throw new Error('Brak uprawnień do usunięcia tego zestawu.')
  }

  // 3. Delete files from Storage if they exist
  if (deck.source_image_urls && deck.source_image_urls.length > 0) {
    const filesToDelete: string[] = []
    
    for (const url of deck.source_image_urls) {
      if (!url) continue
      const parts = url.split('/deck-images/')
      if (parts.length > 1) {
        filesToDelete.push(parts[1])
      }
    }

    if (filesToDelete.length > 0) {
      try {
        const { error: storageError } = await supabase.storage
          .from('deck-images')
          .remove(filesToDelete)
          
        if (storageError) {
          console.error('Failed to delete some images from storage:', storageError)
          // Continue execution, do not block deck deletion
        }
      } catch (err) {
        console.error('Error during storage deletion:', err)
        // Continue execution
      }
    }
  }

  // 4. Delete the deck from database (cards will be cascade deleted)
  const { error: deleteError } = await supabase
    .from('decks')
    .delete()
    .eq('id', deckId)
    .eq('user_id', userData.user.id) // Double check

  if (deleteError) {
    throw new Error(`Błąd usuwania zestawu: ${deleteError.message}`)
  }

  // 5. Revalidate paths
  revalidatePath('/')
  revalidatePath('/dashboard')
  
  return { success: true }
}

