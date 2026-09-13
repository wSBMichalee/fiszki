'use client'

import { motion } from 'framer-motion'

interface PreviewStepProps {
  photo: string | null
  onBack: () => void
  onParseImage: () => void
}

export default function PreviewStep({ photo, onBack, onParseImage }: PreviewStepProps) {
  return (
    <motion.div 
      key="preview"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="flex-1 flex flex-col bg-black relative"
    >
      {photo && <img src={photo} alt="Preview" className="w-full h-full object-contain" />}
      
      <div className="absolute bottom-0 inset-x-0 p-6 flex justify-between bg-gradient-to-t from-black/80 to-transparent gap-4">
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
