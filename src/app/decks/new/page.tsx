import Scanner from '@/components/Scanner'
import { Suspense } from 'react'

export default function NewDeckPage() {
  return (
    <main className="flex-1 max-w-3xl w-full mx-auto p-4 flex flex-col min-h-[calc(100dvh-64px)] sm:h-[calc(100vh-64px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-serif text-[--color-navy]">Skaner fiszek</h1>
        <p className="text-[--color-graphite] text-sm mt-1">Zrób zdjęcie notatek, a AI zamieni je na fiszki.</p>
      </div>
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Ładowanie skanera...</div>}>
        <Scanner />
      </Suspense>
    </main>
  )
}
