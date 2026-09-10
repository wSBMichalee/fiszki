import Link from 'next/link'
import { logout } from '@/app/login/actions'
import { createClient } from '@/utils/supabase/server'
import Button from '@/components/Button'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="w-full sticky top-0 z-50 bg-[var(--color-ivory)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link 
          href={user ? "/dashboard" : "/"} 
          className="inline-flex items-center px-4 py-1.5 rounded-2xl bg-white/70 backdrop-blur-md border border-black/5 shadow-[0_4px_20px_rgba(28,43,69,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] text-xl sm:text-2xl font-bold text-[var(--color-navy)] tracking-tight hover:bg-white transition-all duration-200 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-navy)]/10"
        >
          Fiszki
        </Link>
        
        {user ? (
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-sm font-medium text-[var(--color-graphite)] hidden sm:inline-block">
              {user.email}
            </span>
            <form action={logout}>
              <Button type="submit" variant="danger" size="md">
                Wyloguj
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button href="/login" variant="ghost" size="md">
              Zaloguj się
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
