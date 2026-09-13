import { useState } from 'react'
import Link from 'next/link'
import { Check, X, ArrowRightLeft, Trophy, Sparkles, RotateCcw, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Card, StudyGoal } from './StudyMode'
import { getWeightedShuffle } from './StudyMode'

import { Box } from 'lucide-react'

interface StudyModeExamProps {
  deckId: string
  cards: Card[]
  currentIndex: number
  setCards: React.Dispatch<React.SetStateAction<Card[]>>
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
  onCardLearned: (cardId: string, learned: boolean) => void
  onSwitchMode: (mode: 'standard' | 'exam' | 'defense') => void
  currentMode: 'standard' | 'exam' | 'defense'
  studyGoal?: StudyGoal
}

export default function StudyModeExam({
  cards,
  currentIndex,
  setCards,
  setCurrentIndex,
  onCardLearned,
  onSwitchMode,
  currentMode,
  studyGoal = 'other'
}: StudyModeExamProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [showLearned, setShowLearned] = useState(false)
  const [is3D, setIs3D] = useState(true)

  const currentCard = cards[currentIndex]

  const handleNext = (learned: boolean) => {
    setDirection(learned ? 'right' : 'left')

    if (currentCard.learned !== learned) {
      const newCards = [...cards]
      newCards[currentIndex] = { ...currentCard, learned }
      setCards(newCards)
      onCardLearned(currentCard.id, learned)
    }

    setTimeout(() => {
      proceedToNext()
    }, 280)
  }

  const proceedToNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setIsFlipped(false)
      setDirection(null)
    } else {
      setIsFinished(true)
    }
  }

  const handleRestartExam = () => {
    // Ponowne ważone przetasowanie bez zwracania
    const reShuffled = getWeightedShuffle(cards)
    setCards(reShuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    setIsFinished(false)
    setDirection(null)
  }

  const learnedCount = cards.filter((c) => c.learned).length
  const totalCount = cards.length
  const progressPercent = totalCount > 0 ? Math.min(100, Math.round((currentIndex / totalCount) * 100)) : 0
  const successRate = totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0

  if (isFinished) {
    let heading = successRate === 100 ? "Wynik: 100%!" : successRate >= 70 ? "Egzamin zdany!" : "Koniec egzaminu"
    if (studyGoal === 'oral') {
      heading = successRate === 100 ? "Obrona bezbłędna!" : successRate >= 70 ? "Obrona zaliczona!" : "Koniec obrony"
    } else if (studyGoal === 'written') {
      heading = successRate === 100 ? "Test na 100%!" : successRate >= 70 ? "Test zdany!" : "Koniec testu"
    }

    const cardsToReview = cards.filter(c => !c.learned)
    const cardsLearned = cards.filter(c => c.learned)

    return (
      <div className="flex-1 flex flex-col items-center justify-start p-4 py-8 overflow-y-auto w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          className="w-full max-w-xl bg-white rounded-[36px] shadow-[0_20px_50px_rgba(28,43,69,0.08)] border border-gray-100 p-8 sm:p-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[var(--color-gold)]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Trophy Badge */}
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.15 }}
            className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-[var(--color-gold)] to-[#fce49e] flex items-center justify-center mb-6 shadow-[0_12px_28px_rgba(217,164,65,0.35)] relative"
          >
            <Trophy className="w-12 h-12 text-[var(--color-navy)]" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
            </motion.div>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-navy)] mb-2 tracking-tight">
            {heading}
          </h2>
          
          <p className="text-xl font-bold text-[var(--color-gold)] mb-8">Wynik: {successRate}%</p>

          {/* Review Lists */}
          <div className="w-full text-left space-y-6 mb-8 border-t border-gray-100 pt-6">
            <p className="text-[var(--color-graphite)] text-base mb-8 leading-relaxed">
              {successRate === 100 
                ? "Doskonale! Znasz odpowiedź na każde losowe pytanie." 
                : `Poprawne odpowiedzi: ${learnedCount} z ${totalCount} wylosowanych fiszek. Fiszki, z którymi masz trudność, pojawiają się częściej.`}
            </p>
            {cardsToReview.length > 0 && (
              <div>
                <h3 className="font-bold text-[var(--color-brick)] mb-3 flex items-center gap-2">
                  <X size={18} />
                  Błędy podczas egzaminu ({cardsToReview.length})
                </h3>
                <div className="flex flex-col gap-2">
                  {cardsToReview.map(c => (
                    <div key={c.id} className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-sm font-medium text-[var(--color-navy)]">
                      {c.question}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cardsLearned.length > 0 && (
              <div className="bg-emerald-50/30 rounded-xl border border-emerald-100 overflow-hidden">
                <button 
                  onClick={() => setShowLearned(!showLearned)}
                  className="w-full flex items-center justify-between p-4 font-bold text-[var(--color-success)] hover:bg-emerald-50/50 transition-colors"
                >
                  <span className="flex items-center gap-2"><Check size={18} /> Poprawne odpowiedzi ({cardsLearned.length})</span>
                  {showLearned ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <AnimatePresence>
                  {showLearned && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 flex flex-col gap-2 border-t border-emerald-100/50">
                        {cardsLearned.map(c => (
                          <div key={c.id} className="p-3 bg-white border border-emerald-100 rounded-xl text-sm font-medium text-[var(--color-navy)] opacity-80">
                            {c.question}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={handleRestartExam}
              className="w-full py-4 px-6 bg-[var(--color-navy)] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-[0_6px_0_#0f1726] active:shadow-none active:translate-y-1 transition-all cursor-pointer"
            >
              <RotateCcw size={18} />
              Rozpocznij nowy egzamin
            </motion.button>

            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 py-3 text-[var(--color-graphite)] font-medium text-sm hover:text-[var(--color-navy)] transition-colors mt-1"
            >
              <ArrowLeft size={16} />
              Wróć do listy zestawów
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!currentCard) {
    return null
  }

  return (
    <div className="flex-1 flex flex-col items-center max-w-md mx-auto w-full pt-2 pb-6">
      {/* Progress Bar & Header Controls */}
      <div className="w-full px-4 mb-6">
        <div className="flex justify-between items-center mb-2.5 text-xs font-bold text-[var(--color-graphite)]">
          <div className="flex items-center gap-1.5">
            <span className="bg-white/80 px-2.5 py-1 rounded-full border border-gray-200 shadow-xs font-semibold text-[var(--color-navy)]">
              Egzamin: {currentIndex + 1} z {totalCount}
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
      
      {/* Card area with 3D examination stack effect */}
      <div className="w-full aspect-[3/4] relative perspective-1000 px-1 sm:px-4">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={currentCard.id}
            custom={direction}
            initial={{ 
              scale: 0.92, 
              y: 25, 
              opacity: 0,
              rotateZ: direction === 'right' ? -3 : direction === 'left' ? 3 : 0
            }}
            animate={{ 
              scale: 1, 
              y: 0, 
              x: 0, 
              rotateZ: 0,
              opacity: 1, 
              rotateY: isFlipped && is3D ? 180 : 0 
            }}
            exit={{ 
              x: direction === 'right' ? 420 : direction === 'left' ? -420 : 0, 
              y: direction === 'right' ? -40 : direction === 'left' ? 40 : 0, 
              rotateZ: direction === 'right' ? 22 : direction === 'left' ? -22 : 0, 
              scale: 0.85,
              opacity: 0,
              transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 28 
              }
            }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            style={{ transformStyle: is3D ? "preserve-3d" : "flat" }}
            className="w-full h-full absolute inset-0 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div 
              className="absolute inset-0 backface-hidden bg-[var(--color-ivory)] rounded-[32px] shadow-[0_12px_36px_rgba(28,43,69,0.07)] border border-gray-200/90 flex flex-col items-center justify-center p-6 sm:p-10 text-center select-none"
              style={!is3D ? { opacity: isFlipped ? 0 : 1, transition: 'opacity 0.2s' } : {}}
            >
              <span className="absolute top-6 text-xs font-bold uppercase tracking-widest text-[var(--color-navy)]/35">
                Pytanie egzaminacyjne
              </span>
              
              <h3 className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-[var(--color-navy)] leading-snug tracking-tight my-auto">
                {currentCard.question}
              </h3>
              
              <div className="text-[var(--color-graphite)] text-xs sm:text-sm font-semibold opacity-60 flex items-center gap-1.5 bg-white/60 px-3.5 py-1.5 rounded-full border border-gray-200/60 shadow-xs">
                <span>Kliknij, aby sprawdzić odpowiedź</span>
              </div>
            </div>
            
            {/* Back */}
            <div 
              className="absolute inset-0 backface-hidden bg-white rounded-[32px] shadow-[0_12px_36px_rgba(28,43,69,0.07)] border-2 border-[var(--color-gold)] flex flex-col items-center justify-center p-6 sm:p-10 text-center select-none"
              style={
                is3D 
                  ? { transform: "rotateY(180deg)" } 
                  : { transform: "rotateY(0deg)", opacity: isFlipped ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: isFlipped ? 'auto' : 'none' }
              }
            >
              <span className="absolute top-6 text-xs font-bold uppercase tracking-widest text-[var(--color-gold)]">
                Odpowiedź
              </span>
              
              <p className="font-serif font-semibold text-lg sm:text-xl md:text-2xl text-[var(--color-navy)] leading-snug tracking-tight my-auto">
                {currentCard.answer}
              </p>

              <div className="text-[var(--color-graphite)] text-xs sm:text-sm font-semibold opacity-60 flex items-center gap-1.5 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-200/60 shadow-xs">
                <span>Oceń swoją znajomość poniżej</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stack effect for 3D examination mode */}
        {currentIndex < cards.length - 1 && (
          <div className="absolute inset-0 -z-10 bg-white rounded-[32px] border border-gray-200/60 shadow-xs transform translate-y-3.5 scale-[0.96] opacity-70 pointer-events-none" />
        )}
        {currentIndex < cards.length - 2 && (
          <div className="absolute inset-0 -z-20 bg-white rounded-[32px] border border-gray-200/60 shadow-xs transform translate-y-7 scale-[0.92] opacity-40 pointer-events-none" />
        )}
      </div>
      
      {/* Controls: Tactile 3D Duolingo-style action buttons */}
      <div className="w-full mt-8 px-4">
        <motion.div 
          animate={{ 
            opacity: isFlipped ? 1 : 0.45, 
            y: isFlipped ? 0 : 8,
            scale: isFlipped ? 1 : 0.98
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="grid grid-cols-2 gap-4"
        >
          {/* Button: Repeat */}
          <motion.button 
            disabled={!isFlipped}
            whileHover={isFlipped ? { scale: 1.02 } : {}}
            whileTap={isFlipped ? { scale: 0.96 } : {}}
            onClick={(e) => { e.stopPropagation(); handleNext(false); }}
            className={`flex flex-col items-center justify-center gap-1.5 py-4 px-3 bg-white border-2 border-[var(--color-brick)]/30 rounded-2xl text-[var(--color-brick)] transition-colors shadow-[0_5px_0_rgba(184,74,57,0.25)] active:shadow-none active:translate-y-1 ${
              isFlipped ? 'cursor-pointer hover:bg-red-50/60' : 'cursor-not-allowed opacity-50'
            }`}
          >
            <X size={26} strokeWidth={2.8} />
            <span className="font-bold text-sm tracking-tight">Muszę powtórzyć</span>
          </motion.button>

          {/* Button: Learned */}
          <motion.button 
            disabled={!isFlipped}
            whileHover={isFlipped ? { scale: 1.02 } : {}}
            whileTap={isFlipped ? { scale: 0.96 } : {}}
            onClick={(e) => { e.stopPropagation(); handleNext(true); }}
            className={`flex flex-col items-center justify-center gap-1.5 py-4 px-3 bg-[var(--color-success)] text-white border-2 border-emerald-700/80 rounded-2xl transition-colors shadow-[0_5px_0_#1b5934] active:shadow-none active:translate-y-1 ${
              isFlipped ? 'cursor-pointer hover:bg-[#236b41]' : 'cursor-not-allowed opacity-50'
            }`}
          >
            <Check size={26} strokeWidth={2.8} />
            <span className="font-bold text-sm tracking-tight">Umiem to!</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
