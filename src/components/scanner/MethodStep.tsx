'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Camera, Upload, FileText } from 'lucide-react'

interface MethodStepProps {
  subject: string
  onBack: () => void
  onSelectCamera: () => void
  onSelectText: () => void
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function MethodStep({
  subject,
  onBack,
  onSelectCamera,
  onSelectText,
  onFileUpload
}: MethodStepProps) {
  return (
    <motion.div
      key="method"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center relative min-h-0 overflow-y-auto"
    >
      <button
        type="button"
        onClick={onBack}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 px-3.5 py-2.5 min-h-[44px] rounded-full bg-gray-100 text-[var(--color-navy)] text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-200 cursor-pointer transition-colors"
      >
        <ArrowLeft size={16} />
        Wróć
      </button>
      
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-navy)] tracking-tight mb-2 mt-10 sm:mt-0">
        Jak chcesz dodać notatki?
      </h2>
      <p className="text-[var(--color-graphite)] text-sm mb-8 leading-relaxed max-w-sm">
        Wybierz najwygodniejszy sposób wprowadzenia materiału do analizy dla: <strong>{subject}</strong>.
      </p>

      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Take Photo */}
        <button
          onClick={onSelectCamera}
          className="flex flex-col items-center text-center p-6 rounded-2xl border-2 border-gray-100 hover:border-[var(--color-gold)]/50 hover:bg-amber-50/30 transition-all duration-200 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-[var(--color-gold)]/20 text-[var(--color-navy)] group-hover:text-[var(--color-gold)] flex items-center justify-center mb-4 transition-colors">
            <Camera size={24} />
          </div>
          <h3 className="font-bold text-[var(--color-navy)] mb-1">Zrób zdjęcie</h3>
          <p className="text-xs text-[var(--color-graphite)] leading-relaxed">Użyj aparatu, aby zrobić zdjęcie papierowym notatkom.</p>
        </button>

        {/* Upload Photo */}
        <label className="flex flex-col items-center text-center p-6 rounded-2xl border-2 border-gray-100 hover:border-[var(--color-gold)]/50 hover:bg-amber-50/30 transition-all duration-200 cursor-pointer group">
          <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-[var(--color-gold)]/20 text-[var(--color-navy)] group-hover:text-[var(--color-gold)] flex items-center justify-center mb-4 transition-colors">
            <Upload size={24} />
          </div>
          <h3 className="font-bold text-[var(--color-navy)] mb-1">Wgraj zdjęcie</h3>
          <p className="text-xs text-[var(--color-graphite)] leading-relaxed">Wybierz obraz z galerii lub plik z urządzenia.</p>
          <input 
            type="file" 
            accept="image/*" 
            onChange={onFileUpload}
            className="hidden"
          />
        </label>

        {/* Paste Text */}
        <button
          onClick={onSelectText}
          className="flex flex-col items-center text-center p-6 rounded-2xl border-2 border-gray-100 hover:border-[var(--color-gold)]/50 hover:bg-amber-50/30 transition-all duration-200 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-[var(--color-gold)]/20 text-[var(--color-navy)] group-hover:text-[var(--color-gold)] flex items-center justify-center mb-4 transition-colors">
            <FileText size={24} />
          </div>
          <h3 className="font-bold text-[var(--color-navy)] mb-1">Wklej tekst</h3>
          <p className="text-xs text-[var(--color-graphite)] leading-relaxed">Skopiuj tekst z Notatek, Google Keep lub dowolnej aplikacji i wklej tutaj.</p>
        </button>
      </div>
    </motion.div>
  )
}
