'use client'

import { useState } from 'react'
import { Check, X, Shuffle, ArrowRightLeft } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { motion, AnimatePresence } from 'framer-motion'

type Card = {
  id: string
  deck_id: string
  question: string
  answer: string
  learned: boolean
}

type StudyType = 'standard' | 'exam'

export default function StudyMode({ deckId, initialCards }: { deckId: string, initialCards: Card[] }) {
  const [cards, setCards] = useState<Card[]>(initialCards)
  const [studyType, setStudyType] = useState<StudyType>('standard')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const currentCard = cards[currentIndex]

  const handleNext = async (learned: boolean) => {
    // Determine fly direction for exam mode
    setDirection(learned ? 'right' : 'left')

    // Save to DB
    if (currentCard.learned !== learned) {
      const newCards = [...cards]
      newCards[currentIndex] = { ...currentCard, learned }
      setCards(newCards)
      
      supabase
        .from('cards')
        .update({ learned })
        .eq('id', currentCard.id)
        .then()
    }

    // Wait for exit animation in exam mode
    if (studyType === 'exam') {
      setTimeout(() => {
        proceedToNext()
      }, 300)
    } else {
      proceedToNext()
    }
  }

  const proceedToNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
      setDirection(null)
    } else {
      setIsFinished(true)
    }
  }

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    setIsFinished(false)
    setDirection(null)
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setIsFinished(false)
    setDirection(null)
  }

  const learnedCount = cards.filter(c => c.learned).length

  if (isFinished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 p-10 text-center"
        >
          <h2 className="text-4xl font-serif font-bold text-[var(--color-navy)] mb-6 tracking-tight">Koniec!</h2>
          
          <div className="mx-auto w-32 h-32 rounded-full bg-green-50 flex items-center justify-center mb-8 border border-green-100/50">
            <span className="text-4xl font-bold text-[var(--color-success)]">{learnedCount}<span className="text-xl text-green-700/50">/{cards.length}</span></span>
          </div>
          
          <p className="text-[var(--color-graphite)] text-lg mb-10 leading-relaxed">
            Udało Ci się zapamiętać <strong className="text-[var(--color-navy)]">{learnedCount}</strong> {learnedCount === 1 ? 'fiszkę' : learnedCount >= 2 && learnedCount <= 4 ? 'fiszki' : 'fiszek'}.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleRestart}
              className="flex-1 px-6 py-4 border border-gray-200 bg-white text-[var(--color-navy)] rounded-2xl font-semibold transition-transform duration-[160ms] ease-[var(--ease-out)] cursor-pointer active:scale-[0.97]"
            >
              Powtórz
            </button>
            <button 
              onClick={handleShuffle}
              className="flex-1 px-6 py-4 bg-[var(--color-navy)] text-white rounded-2xl font-semibold transition-transform duration-[160ms] ease-[var(--ease-out)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97]"
            >
              <Shuffle size={18} /> Tasuj
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center max-w-md mx-auto w-full pt-4 pb-8">
      {/* Header controls */}
      <div className="w-full flex justify-between items-center mb-8 px-4 text-sm font-semibold text-[var(--color-graphite)]">
        <span className="bg-white/50 px-3 py-1.5 rounded-full border border-gray-200/50 shadow-sm">
          {currentIndex + 1} / {cards.length}
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setStudyType(prev => prev === 'standard' ? 'exam' : 'standard')
              handleRestart()
            }}
            className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-full border border-gray-200/50 hover:bg-white hover:text-[var(--color-navy)] transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowRightLeft size={16} /> 
            {studyType === 'standard' ? 'Przeglądanie' : 'Egzamin'}
          </button>
        </div>
      </div>
      
      {/* Card area */}
      <div className="w-full aspect-[3/4] relative perspective-1000 px-4">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={currentCard.id}
            custom={direction}
            initial={
              studyType === 'exam' 
                ? { scale: 0.9, y: 40, opacity: 0 } 
                : { opacity: 0, x: direction === 'right' ? 100 : -100 }
            }
            animate={{ scale: 1, y: 0, x: 0, opacity: 1, rotateY: isFlipped ? 180 : 0 }}
            exit={
              studyType === 'exam' 
                ? { 
                    x: direction === 'right' ? 300 : -300, 
                    y: 100, 
                    rotateZ: direction === 'right' ? 15 : -15, 
                    opacity: 0,
                    transition: { duration: 0.3 }
                  } 
                : { opacity: 0, scale: 0.95 }
            }
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            style={{ transformStyle: "preserve-3d" }}
            className="w-full h-full absolute inset-0 cursor-pointer px-4"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div className="absolute inset-0 mx-4 backface-hidden bg-[var(--color-ivory)] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200/80 flex flex-col items-center justify-center p-10 text-center">
              <h3 className="font-serif font-bold text-3xl text-[var(--color-navy)] leading-snug tracking-tight">
                {currentCard.question}
              </h3>
              <div className="absolute bottom-8 text-[var(--color-graphite)] text-sm font-semibold opacity-40">
                Dotknij by odwrócić
              </div>
            </div>
            
            {/* Back */}
            <div 
              className="absolute inset-0 mx-4 backface-hidden bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-[var(--color-gold)] flex flex-col items-center justify-center p-10 text-center"
              style={{ transform: "rotateY(180deg)" }}
            >
              <p className="font-serif font-semibold text-2xl text-[var(--color-navy)] leading-snug tracking-tight">
                {currentCard.answer}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stack effect for exam mode */}
        {studyType === 'exam' && currentIndex < cards.length - 1 && (
          <div className="absolute inset-0 mx-4 -z-10 bg-white rounded-[32px] border border-gray-200/50 shadow-sm transform translate-y-4 scale-[0.95] opacity-60 pointer-events-none"></div>
        )}
        {studyType === 'exam' && currentIndex < cards.length - 2 && (
          <div className="absolute inset-0 mx-4 -z-20 bg-white rounded-[32px] border border-gray-200/50 shadow-sm transform translate-y-8 scale-[0.90] opacity-30 pointer-events-none"></div>
        )}
      </div>
      
      {/* Controls */}
      <div className="w-full mt-10 px-4">
        <motion.div 
          animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 20 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className={`grid grid-cols-2 gap-4 ${isFlipped ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(false); }}
            className="flex flex-col items-center justify-center gap-3 py-5 bg-white border border-[var(--color-brick)]/20 rounded-2xl text-[var(--color-brick)] hover:bg-red-50/50 transition-colors cursor-pointer shadow-[0_4px_20px_rgb(0,0,0,0.03)] active:scale-[0.97]"
          >
            <X size={28} />
            <span className="font-semibold text-sm">Muszę powtórzyć</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(true); }}
            className="flex flex-col items-center justify-center gap-3 py-5 bg-white border border-[var(--color-success)]/20 rounded-2xl text-[var(--color-success)] hover:bg-green-50/50 transition-colors cursor-pointer shadow-[0_4px_20px_rgb(0,0,0,0.03)] active:scale-[0.97]"
          >
            <Check size={28} />
            <span className="font-semibold text-sm">Umiem to</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
