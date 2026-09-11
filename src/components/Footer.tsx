import Link from "next/link";

export default function Footer({ className = "bg-[var(--color-surface-alt)]" }: { className?: string }) {
  return (
    <footer className={`w-full ${className} pt-12 pb-14`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo / Nazwa */}
          <Link 
            href="/" 
            className="text-xl font-bold text-[var(--color-navy)] tracking-tight hover:text-[var(--color-gold)] transition-colors"
          >
            Fiszki
          </Link>

          {/* Linki po prawej */}
          <nav className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-[var(--color-graphite)]">
            <Link 
              href="/kontakt" 
              className="py-2 hover:text-[var(--color-navy)] transition-colors inline-block"
            >
              Kontakt
            </Link>
            <Link 
              href="/regulamin" 
              className="py-2 hover:text-[var(--color-navy)] transition-colors inline-block"
            >
              Regulamin
            </Link>
            <Link 
              href="/polityka-prywatnosci" 
              className="py-2 hover:text-[var(--color-navy)] transition-colors inline-block"
            >
              Polityka prywatności
            </Link>
          </nav>
        </div>

        {/* Rok i copyright */}
        <div className="pt-6 border-t border-[var(--color-navy)]/5 text-center sm:text-left text-xs text-[var(--color-graphite)]/60">
          © 2026 Fiszki
        </div>
      </div>
    </footer>
  );
}
