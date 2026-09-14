import { useState } from 'react'
import Link from 'next/link'
import { ArrowRightLeft, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Card, StudyGoal } from './StudyMode'
import { getWeightedShuffle } from './StudyMode'

import { Box } from 'lucide-react'

interface StudyModeStandardProps {
  deckId: string
  cards: Card[]
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
  onSwitchMode: (mode: 'standard' | 'exam' | 'defense') => void
  currentMode: 'standard' | 'exam' | 'defense'
  studyGoal?: StudyGoal
}

export default function StudyModeStandard({
  cards,
  currentIndex,
  setCurrentIndex,
  onSwitchMode,
  currentMode,
}: StudyModeStandardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [is3D, setIs3D] = useState(true)

  const currentCard = cards[currentIndex]
  const totalCount = cards.length
  const progressPercent = totalCount > 0 ? Math.min(100, Math.round(((currentIndex + 1) / totalCount) * 100)) : 0

  const handleNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setDirection('right')
      setIsFlipped(false)
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, 50)
    }
  }

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setDirection('left')
      setIsFlipped(false)
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1)
      }, 50)
    }
  }

  if (!currentCard) {
    return null
  }

  return (
    <div className="flex-1 flex flex-col items-center max-w-lg mx-auto w-full pt-2 pb-6 px-2">
      {/* Progress Bar & Header Controls */}
      <div className="w-full px-4 mb-6">
        <div className="flex justify-between items-center mb-2.5 text-xs font-bold text-[var(--color-graphite)]">
          <div className="flex items-center gap-1.5">
            <span className="bg-white/80 px-2.5 py-1 rounded-full border border-gray-200 shadow-xs font-semibold text-[var(--color-navy)]">
              Karta {currentIndex + 1} z {totalCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-white/80 p-0.5 rounded-full border border-gray-200 shadow-xs">
              {(['standard', 'exam', 'defense'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => onSwitchMode(mode)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    currentMode === mode
                      ? 'bg-[var(--color-navy)] text-white shadow-sm'
                      : 'text-[var(--color-graphite)] hover:text-[var(--color-navy)] hover:bg-gray-50'
                  }`}
                >
                  {mode === 'standard' ? 'Przeglądanie' : mode === 'exam' ? 'Egzamin' : 'Obrona'}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setIs3D(!is3D)}
              className={`p-1.5 rounded-full border shadow-xs transition-colors ${
                is3D ? 'bg-[var(--color-gold)] text-white border-transparent' : 'bg-white/80 text-[var(--color-graphite)] border-gray-200 hover:bg-gray-50'
              }`}
              title="Przełącz animację 3D"
            >
              <Box size={14} />
            </button>
          </div>
        </div>

        {/* Dynamic Spring Progress Bar */}
        <div className="w-full h-3 bg-gray-200/90 rounded-full p-0.5 overflow-hidden shadow-inner relative">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] via-[#e6b34e] to-[#f4c868] shadow-xs relative"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(8, progressPercent)}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full h-1/2" />
          </motion.div>
        </div>
      </div>
      
      <div className="w-full flex items-center justify-center relative">
        <button 
          onClick={handlePrevCard}
          disabled={currentIndex === 0}
          className={`absolute left-0 z-10 p-3 rounded-full bg-white border border-gray-200 shadow-md transition-all active:scale-90 ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-gray-50'}`}
        >
          <ChevronLeft className="text-[var(--color-navy)]" size={24} />
        </button>

        <div className="w-full max-w-[320px] relative perspective-1000">
          <AnimatePresence custom={direction}>
            <motion.div
              key={currentCard.id}
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x < -50 || velocity.x < -400) {
                  handleNextCard()
                } else if (offset.x > 50 || velocity.x > 400) {
                  handlePrevCard()
                }
              }}
              initial={{ 
                scale: 0.92, 
                x: direction === 'right' ? 300 : direction === 'left' ? -300 : 0,
                opacity: 0,
                rotateZ: direction === 'right' ? 8 : direction === 'left' ? -8 : 0
              }}
              animate={{ 
                scale: 1, 
                x: 0, 
                rotateZ: 0,
                opacity: 1, 
                rotateY: isFlipped && is3D ? 180 : 0 
              }}
              exit={{ 
                x: direction === 'right' ? -300 : direction === 'left' ? 300 : 0, 
                rotateZ: direction === 'right' ? -8 : direction === 'left' ? 8 : 0, 
                scale: 0.9,
                opacity: 0,
                transition: { type: "spring", stiffness: 400, damping: 28 }
              }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              style={{ transformStyle: is3D ? "preserve-3d" : "flat" }}
              className="w-full min-h-[400px] grid cursor-pointer touch-pan-y"
              onClick={() => setIsFlipped(!isFlipped)}
            >
            {/* Front */}
            <div 
              className="col-start-1 row-start-1 backface-hidden bg-[var(--color-ivory)] rounded-[32px] shadow-[0_12px_36px_rgba(28,43,69,0.07)] border border-gray-200/90 flex flex-col items-center p-6 sm:p-8 pt-16 pb-16 text-center select-none"
              style={!is3D ? { opacity: isFlipped ? 0 : 1, transition: 'opacity 0.2s', zIndex: isFlipped ? 0 : 1 } : { zIndex: isFlipped ? 0 : 1 }}
            >
              <span className="absolute top-6 text-xs font-bold uppercase tracking-widest text-[var(--color-navy)]/35">
                Pytanie
              </span>
              
              <div className="flex-1 flex flex-col justify-center items-center w-full min-h-0">
                <h3 className={`font-serif font-bold text-[var(--color-navy)] leading-snug tracking-tight ${currentCard.question.length > 120 ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl md:text-3xl'}`}>
                  {currentCard.question}
                </h3>
              </div>
              
              <div className="absolute bottom-6 text-[var(--color-graphite)] text-xs sm:text-sm font-semibold opacity-60 flex items-center gap-1.5 bg-white/60 px-3.5 py-1.5 rounded-full border border-gray-200/60 shadow-xs">
                <span>Kliknij, aby odwrócić</span>
              </div>
            </div>
            
            {/* Back */}
            <div 
              className="col-start-1 row-start-1 backface-hidden bg-white rounded-[32px] shadow-[0_12px_36px_rgba(28,43,69,0.07)] border-2 border-[var(--color-gold)] flex flex-col items-center p-6 sm:p-8 pt-16 pb-16 text-center select-none"
              style={
                is3D 
                  ? { transform: "rotateY(180deg)", zIndex: isFlipped ? 1 : 0 } 
                  : { transform: "rotateY(0deg)", opacity: isFlipped ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: isFlipped ? 'auto' : 'none', zIndex: isFlipped ? 1 : 0 }
              }
            >
              <span className="absolute top-6 text-xs font-bold uppercase tracking-widest text-[var(--color-gold)]">
                Odpowiedź
              </span>
              
              <div className="flex-1 flex flex-col justify-center items-center w-full min-h-0">
                <p className={`font-serif font-semibold text-[var(--color-navy)] leading-snug tracking-tight ${currentCard.answer.length > 120 ? 'text-base sm:text-lg' : 'text-lg sm:text-xl md:text-2xl'}`}>
                  {currentCard.answer}
                </p>
              </div>

              <div className="absolute bottom-6 text-[var(--color-graphite)] text-xs sm:text-sm font-semibold opacity-60 flex items-center gap-1.5 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-200/60 shadow-xs">
                <span>Oceń swoją znajomość poniżej</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        </div>

        <button 
          onClick={handleNextCard}
          disabled={currentIndex === cards.length - 1}
          className={`absolute right-0 z-10 p-3 rounded-full bg-white border border-gray-200 shadow-md transition-all active:scale-90 ${currentIndex === cards.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-gray-50'}`}
        >
          <ChevronRight className="text-[var(--color-navy)]" size={24} />
        </button>
      </div>
      
      {/* Footer Return Link */}
      <div className="mt-8">
        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 py-3 text-[var(--color-graphite)] font-medium text-sm hover:text-[var(--color-navy)] transition-colors"
        >
          <ArrowLeft size={16} />
          Wróć do listy zestawów
        </Link>
      </div>
    </div>
  )
}
