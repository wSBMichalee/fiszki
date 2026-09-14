'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeckStatusPollerProps {
  deckId: string
  initialStatus: string
  error: string | null
}

export default function DeckStatusPoller({ deckId, initialStatus, error }: DeckStatusPollerProps) {
  const router = useRouter()
  const [timeoutReached, setTimeoutReached] = useState(false)

  useEffect(() => {
    if (initialStatus === 'completed' || initialStatus === 'error') return

    const startTime = Date.now()
    const interval = setInterval(() => {
      if (Date.now() - startTime > 5 * 60 * 1000) {
        setTimeoutReached(true)
        clearInterval(interval)
        return
      }
      // router.refresh() wymusza ponowne wyrenderowanie Server Component (page.tsx)
      // pobierając najnowsze dane z bazy bez pełnego reloadu strony
      router.refresh()
    }, 3000)

    return () => clearInterval(interval)
  }, [initialStatus, router])

  if (initialStatus === 'error') {
    return (
      <div className="text-center py-20 bg-red-50 rounded-2xl border border-dashed border-red-300 shadow-sm">
        <p className="text-red-700 font-medium mb-2">Błąd przetwarzania</p>
        <p className="text-red-600 text-sm">{error || 'Wystąpił nieznany błąd podczas tworzenia fiszek.'}</p>
      </div>
    )
  }

  if (initialStatus === 'completed') return null

  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-4 border-[--color-apricot] border-t-transparent rounded-full animate-spin"></div>
      <div>
        <p className="text-[--color-navy] font-medium">Trwa generowanie fiszek przez AI...</p>
        <p className="text-[--color-graphite] text-sm mt-1">To może zająć od kilkunastu sekund do paru minut.</p>
        {timeoutReached && (
          <p className="text-red-500 text-sm mt-4 font-medium">Przetwarzanie trwa dłużej niż zwykle.<br/>Spróbuj odświeżyć stronę ręcznie za chwilę.</p>
        )}
      </div>
    </div>
  )
}
