import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import StudyMode from '@/components/StudyMode'
import DeckGallery from '@/components/DeckGallery'
import DeckStatusPoller from './DeckStatusPoller'

export default async function DeckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const [deckResult, cardsResult] = await Promise.all([
    supabase
      .from('decks')
      .select('*')
      .eq('id', id)
      .single(),
    supabase
      .from('cards')
      .select('*')
      .eq('deck_id', id)
      .order('created_at', { ascending: true })
  ])

  const { data: deck, error: deckError } = deckResult
  const { data: cards, error: cardsError } = cardsResult

  if (deckError || !deck || cardsError || !cards) {
    notFound()
  }

  const isProcessingOrError = deck.processing_status === 'pending' || deck.processing_status === 'processing' || deck.processing_status === 'error'

  return (
    <main className="flex-1 max-w-2xl w-full mx-auto p-4 md:p-8 flex flex-col min-h-[calc(100dvh-64px)]">
      <div className="mb-4 sm:mb-6 flex justify-between items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-serif text-[--color-navy] line-clamp-1 min-w-0">{deck.title}</h1>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <DeckGallery images={deck.source_image_urls} />
          {!isProcessingOrError && (
            <span className="shrink-0 text-xs sm:text-sm font-medium text-[--color-graphite] bg-white border border-gray-200 px-3 py-1 sm:py-1.5 rounded-full shadow-sm">
              {cards.length} fiszek
            </span>
          )}
        </div>
      </div>
      
      {isProcessingOrError ? (
        <DeckStatusPoller 
          deckId={deck.id} 
          initialStatus={deck.processing_status} 
          error={deck.processing_error} 
        />
      ) : cards.length > 0 ? (
        <Suspense fallback={<div className="flex-1 flex items-center justify-center text-sm text-[var(--color-graphite)]">Ładowanie sesji nauki...</div>}>
          <StudyMode key={id} deckId={id} initialCards={cards} />
        </Suspense>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
          <p className="text-[--color-graphite]">Ten zestaw nie ma jeszcze żadnych fiszek.</p>
        </div>
      )}
    </main>
  )
}
