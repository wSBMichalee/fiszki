'use client'

import { useState } from 'react'
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DeckGallery({ images }: { images: string[] | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) return null

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-[var(--color-navy)] bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm"
      >
        <ImageIcon size={16} className="text-[var(--color-gold)]" />
        <span className="hidden sm:inline">Zobacz oryginalne notatki</span>
        <span className="inline sm:hidden">Notatki</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8"
            onClick={() => setIsOpen(false)}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all z-10"
            >
              <X size={24} />
            </button>

            {images.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-8 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all z-10"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-2 sm:right-8 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all z-10"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none">
              <img 
                src={images[currentIndex]} 
                alt={`Notatka ${currentIndex + 1}`}
                className="max-h-[85vh] max-w-full object-contain pointer-events-auto rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              {images.length > 1 && (
                <div className="absolute bottom-4 sm:bottom-8 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white/90 text-sm font-medium tracking-wide">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
