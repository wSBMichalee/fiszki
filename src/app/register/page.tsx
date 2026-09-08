import { signup } from '../login/actions'
import Link from 'next/link'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams;
  
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-[var(--color-navy)] tracking-tight">Rejestracja</h1>
          <p className="text-[var(--color-graphite)] mt-2">Utwórz nowe konto</p>
        </div>
        
        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-[var(--color-navy)]">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30 focus:border-[var(--color-gold)] transition-[border-color,box-shadow] duration-200 ease-out bg-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-[var(--color-navy)]">Hasło</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30 focus:border-[var(--color-gold)] transition-[border-color,box-shadow] duration-200 ease-out bg-white"
            />
          </div>
          
          {params?.error && (
            <div className="p-3 bg-red-50 text-[var(--color-brick)] text-sm rounded-xl border border-red-100">
              {params.error}
            </div>
          )}
          
          <button
            formAction={signup}
            className="mt-2 w-full py-3.5 bg-[var(--color-navy)] text-white rounded-xl font-medium transition-transform duration-[160ms] ease-[var(--ease-out)] cursor-pointer active:scale-[0.97]"
          >
            Zarejestruj się
          </button>
        </form>
        
        <div className="text-center text-sm text-[var(--color-graphite)]">
          Masz już konto?{' '}
          <Link href="/login" className="text-[var(--color-navy)] font-semibold hover:text-[var(--color-gold)] transition-colors duration-200">
            Zaloguj się
          </Link>
        </div>
      </div>
    </div>
  )
}
