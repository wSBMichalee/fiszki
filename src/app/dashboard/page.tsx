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

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-[var(--color-navy)] tracking-tight">Twoje zestawy</h1>
        <Link 
          href="/decks/new" 
          className="flex items-center gap-2 bg-[var(--color-gold)] text-white px-5 py-2.5 rounded-xl font-medium transition-transform duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]"
        >
          <PlusCircle size={20} />
          <span className="hidden sm:inline">Nowy zestaw</span>
        </Link>
      </div>

      <DashboardGrid decks={decks || []} />
    </main>
  )
}
