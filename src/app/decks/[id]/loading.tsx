import { Loader2 } from 'lucide-react'

export default function LoadingDeck() {
  return (
    <main className="flex-1 max-w-2xl w-full mx-auto p-4 md:p-8 flex flex-col min-h-[calc(100dvh-64px)]">
      <div className="mb-4 sm:mb-6 flex justify-between items-center gap-3">
        <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-full"></div>
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded-full"></div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center max-w-lg mx-auto w-full pt-2 pb-6 px-2">
        <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-[32px] border border-gray-200 flex flex-col items-center justify-center shadow-sm">
          <Loader2 className="w-10 h-10 text-[var(--color-navy)]/30 animate-spin mb-4" />
          <p className="text-gray-400 font-medium">Ładowanie fiszek...</p>
        </div>
      </div>
    </main>
  )
}
