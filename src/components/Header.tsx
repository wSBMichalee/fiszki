import Link from 'next/link'
import { logout } from '@/app/login/actions'
import { createClient } from '@/utils/supabase/server'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-[var(--color-navy)]/5 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={user ? "/dashboard" : "/"} className="font-serif text-2xl font-bold text-[var(--color-navy)] tracking-tight">
          Fiszki
        </Link>
        
        {user ? (
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-[var(--color-graphite)] hidden sm:inline-block">
              {user.email}
            </span>
            <form action={logout}>
              <button className="text-sm font-semibold text-[var(--color-brick)] hover:opacity-70 transition-opacity duration-200 cursor-pointer active:scale-[0.97]">
                Wyloguj
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-4">
             <Link href="/login" className="text-sm font-semibold text-[var(--color-navy)] hover:opacity-70 transition-opacity duration-200 active:scale-[0.97]">
                Zaloguj
             </Link>
          </div>
        )}
      </div>
    </header>
  )
}
