import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import HeaderNav from './HeaderNav'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userDecks: { id: string; title: string; subject: string | null }[] = []
  if (user) {
    const { data } = await supabase
      .from('decks')
      .select('id, title, subject')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (data) {
      userDecks = data
    }
  }

  return (
    <header className="w-full sticky top-0 z-50 bg-[var(--color-ivory)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link 
          href={user ? "/dashboard" : "/"} 
          className="relative z-50 inline-flex items-center px-4 py-1.5 rounded-2xl bg-white/70 backdrop-blur-md border border-black/5 shadow-[0_4px_20px_rgba(28,43,69,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] text-xl sm:text-2xl font-bold text-[var(--color-navy)] tracking-tight hover:bg-white transition-all duration-200 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-navy)]/10"
        >
          Fiszki
        </Link>
        
        <HeaderNav user={user ? { email: user.email } : null} decks={userDecks} />
      </div>
    </header>
  )
}
