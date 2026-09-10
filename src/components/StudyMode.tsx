'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import StudyModeStandard from './StudyModeStandard'
import StudyModeExam from './StudyModeExam'

export type Card = {
  id: string
  deck_id: string
  question: string
  answer: string
  learned: boolean
}

type StudyType = 'standard' | 'exam'

export default function StudyMode({
  deckId,
  initialCards,
}: {
  deckId: string
  initialCards: Card[]
}) {
  const [cards, setCards] = useState<Card[]>(initialCards)
  const [studyType, setStudyType] = useState<StudyType>('standard')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleCardLearned = (cardId: string, learned: boolean) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, learned } : c))
    )
    supabase.from('cards').update({ learned }).eq('id', cardId).then()
  }

  if (studyType === 'exam') {
    return (
      <StudyModeExam
        deckId={deckId}
        cards={cards}
        onCardLearned={handleCardLearned}
        onSwitchMode={() => setStudyType('standard')}
      />
    )
  }

  return (
    <StudyModeStandard
      deckId={deckId}
      cards={cards}
      onCardLearned={handleCardLearned}
      onSwitchMode={() => setStudyType('exam')}
    />
  )
}
