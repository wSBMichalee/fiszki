'use client'

import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'

export default function LoadingStep() {
  return (
    <motion.div 
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="mb-8"
      >
        <RefreshCw className="w-12 h-12 text-[var(--color-gold)]" />
      </motion.div>
      
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <h2 className="text-2xl font-serif font-bold text-[var(--color-navy)] tracking-tight">Analizowanie materiału...</h2>
        <p className="text-[var(--color-graphite)] mt-3">To może zająć kilkanaście sekund. Sztuczna inteligencja wyciąga pytania i odpowiedzi.</p>
      </motion.div>
    </motion.div>
  )
}
