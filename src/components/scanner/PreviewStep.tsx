'use client'

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

interface PreviewStepProps {
  photo: string | null
  onBack: () => void
  onParseImage: () => void
}

export default function PreviewStep({ photo, onBack, onParseImage }: PreviewStepProps) {
  const isPdf = photo?.startsWith('data:application/pdf')

  return (
    <motion.div 
      key="preview"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="flex-1 flex flex-col bg-black relative min-h-0"
    >
      {photo && !isPdf && <img src={photo} alt="Preview" className="w-full h-full object-contain" />}
      
      {photo && isPdf && (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-3xl flex items-center justify-center mb-6 border-2 border-white/20">
            <FileText size={48} className="text-white opacity-80" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Wybrano plik PDF</h3>
          <p className="text-white/60 max-w-sm text-sm sm:text-base">System przetworzy ten dokument i automatycznie wyciągnie z niego wszystkie fiszki.</p>
        </div>
      )}
      
      <div className="absolute bottom-0 inset-x-0 p-6 flex justify-between bg-gradient-to-t from-black/80 to-transparent gap-4 z-10">
        <button 
          onClick={onBack}
          className="flex-1 py-3.5 min-h-[44px] bg-white/20 text-white rounded-xl font-medium backdrop-blur-md cursor-pointer transition-transform duration-[160ms] active:scale-[0.97] border border-white/10 flex items-center justify-center"
        >
          Anuluj
        </button>
        <button 
          onClick={onParseImage}
          className="flex-1 py-3.5 min-h-[44px] bg-[var(--color-gold)] text-white rounded-xl font-medium cursor-pointer transition-transform duration-[160ms] active:scale-[0.97] flex items-center justify-center"
        >
          Użyj tego
        </button>
      </div>
    </motion.div>
  )
}
