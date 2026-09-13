'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Button from '@/components/Button'

interface TextInputStepProps {
  textInput: string
  setTextInput: (val: string) => void
  error: string
  onBack: () => void
  onParseText: () => void
}

export default function TextInputStep({
  textInput,
  setTextInput,
  error,
  onBack,
  onParseText
}: TextInputStepProps) {
  return (
    <motion.div
      key="text"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 relative"
    >
      <div className="w-full max-w-3xl flex flex-col h-full pt-12 sm:pt-4">
        <button
          type="button"
          onClick={onBack}
          className="absolute top-4 left-4 z-20 px-3.5 py-2.5 min-h-[44px] rounded-full bg-gray-100 text-[var(--color-navy)] text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-200 cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} />
          Wróć
        </button>
        
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-[var(--color-navy)]">
            Wklej notatki
          </h2>
          <p className="text-[var(--color-graphite)] text-sm mt-1 text-center">
            Wklej poniżej fragment tekstu (np. artykuł, notatki), aby zamienić go na fiszki.
          </p>
        </div>
        
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Wklej tekst tutaj..."
          className="flex-1 min-h-[300px] w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-[var(--color-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]/15 focus:border-[var(--color-navy)] transition-all resize-none mb-4"
        />
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-[var(--color-brick)] text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <Button
          onClick={onParseText}
          variant="primary"
          size="lg"
          disabled={!textInput.trim()}
          className="w-full shrink-0"
        >
          Wygeneruj fiszki z tekstu
        </Button>
      </div>
    </motion.div>
  )
}
