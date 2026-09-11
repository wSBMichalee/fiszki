import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { PlusCircle } from 'lucide-react'
import DashboardGrid from './DashboardGrid'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: decks } = await supabase
    .from('decks')
    .select('*')
    .order('created_at', { ascending: false })

  const deckList = decks || []
  const deckIds = deckList.map(d => d.id)

  let totalCards = 0
  let learnedCards = 0

  if (deckIds.length > 0) {
    const { data: cards } = await supabase
      .from('cards')
      .select('id, learned')
      .in('deck_id', deckIds)
    
    if (cards) {
      totalCards = cards.length
      learnedCards = cards.filter(c => c.learned).length
    }
  }

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-navy)] tracking-tight">Twoje zestawy</h1>
        <Link 
          href="/decks/new" 
          className="flex items-center justify-center gap-2 bg-[var(--color-gold)] text-white px-4 sm:px-5 py-2.5 min-h-[44px] rounded-xl font-semibold shadow-[0_4px_0_#b58428] active:shadow-none active:translate-y-1 hover:bg-[#e2af49] transition-all shrink-0"
        >
          <PlusCircle size={20} />
          <span className="hidden sm:inline">Nowy zestaw</span>
        </Link>
      </div>

      <DashboardGrid 
        decks={deckList} 
        stats={{ totalCards, learnedCards }}
      />
    </main>
  )
}
