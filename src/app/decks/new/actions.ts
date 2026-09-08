'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveDeck(title: string, cards: {question: string, answer: string}[]) {
  const supabase = await createClient()
  
  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData.user) throw new Error('Brak autoryzacji')

  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .insert({ title, user_id: userData.user.id })
    .select()
    .single()

  if (deckError) throw new Error(deckError.message)

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
