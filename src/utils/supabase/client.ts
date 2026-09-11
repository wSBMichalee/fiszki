import { createBrowserClient } from '@supabase/ssr'
import { parse, serialize } from 'cookie'

export interface CreateClientOptions {
  storage?: Storage
  rememberMe?: boolean
}

export function createClient(options?: CreateClientOptions) {
  const isSessionOnly =
    options?.rememberMe === false ||
    (typeof window !== 'undefined' && options?.storage === window.sessionStorage)

  if (!isSessionOnly) {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      isSingleton: false,
      auth: {
        persistSession: true,
        storage: typeof window !== 'undefined' ? (options?.storage || window.sessionStorage) : undefined,
      },
      cookies: {
        getAll() {
          if (typeof document === 'undefined') return []
          const parsed = parse(document.cookie)
          return Object.keys(parsed).map((name) => ({
            name,
            value: parsed[name] ?? '',
          }))
        },
        setAll(cookiesToSet) {
          if (typeof document === 'undefined') return
          cookiesToSet.forEach(({ name, value, options: cookieOpts }) => {
            const opts = { ...cookieOpts }
            // Delete maxAge and expires so the cookie is a browser session cookie (cleared when browser is closed)
            delete opts.maxAge
            delete opts.expires
            document.cookie = serialize(name, value, opts)
          })
        },
      },
    }
  )
}
