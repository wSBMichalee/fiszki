'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveDeck(
  title: string,
  cards: { question: string; answer: string }[],
  subject?: string
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
