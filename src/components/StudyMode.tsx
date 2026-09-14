'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Coffee, Play } from 'lucide-react'
import StudyModeStandard from './StudyModeStandard'
import StudyModeExam from './StudyModeExam'
import StudyModeDefense from './StudyModeDefense'

export type Card = {
  id: string
  deck_id: string
  question: string
  answer: string
  learned: boolean
}

type StudyType = 'standard' | 'exam' | 'defense'
type StudyState = 'setup' | 'studying' | 'break'

function PomodoroOverlay({ initialTime, startedAt, onTimeUp }: { initialTime: number, startedAt: number, onTimeUp: () => void }) {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, initialTime - Math.floor((Date.now() - startedAt) / 1000)))

  useEffect(() => {
    const checkTime = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      const remaining = initialTime - elapsed
      if (remaining <= 0) {
        onTimeUp()
        return false
      }
      setTimeLeft(remaining)
      return true
    }
    
    if (!checkTime()) return
    const timer = setInterval(checkTime, 1000)
    return () => clearInterval(timer)
  }, [initialTime, startedAt, onTimeUp])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 sm:top-24 sm:right-8 z-40 bg-white/90 backdrop-blur-md shadow-sm border border-gray-200 px-3 py-1.5 rounded-full flex items-center gap-1.5"
    >
      <Timer size={14} className="text-[var(--color-gold)]" />
      <span className="font-mono text-sm font-medium text-[var(--color-navy)] w-11 text-center">
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </span>
    </motion.div>
  )
}

function StudyBreakScreen({ breakTimeMinutes, startedAt, onEndBreak }: { breakTimeMinutes: number, startedAt: number, onEndBreak: () => void }) {
  const initialTime = breakTimeMinutes * 60
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, initialTime - Math.floor((Date.now() - startedAt) / 1000)))

  useEffect(() => {
    const checkTime = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      const remaining = initialTime - elapsed
      if (remaining <= 0) {
        onEndBreak()
        return false
      }
      setTimeLeft(remaining)
      return true
    }
    
    if (!checkTime()) return
    const timer = setInterval(checkTime, 1000)
    return () => clearInterval(timer)
  }, [initialTime, startedAt, onEndBreak])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
          <Coffee size={32} className="text-[var(--color-gold)]" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[var(--color-navy)] mb-2">Czas na przerwę</h2>
        <p className="text-[var(--color-graphite)] text-sm mb-8">Oderwij wzrok od ekranu, napij się wody.</p>
        
        <div className="font-mono text-5xl font-bold text-[var(--color-navy)] tracking-tight mb-8">
          {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </div>
        
        <button 
          onClick={onEndBreak}
          className="flex items-center gap-2 text-sm font-medium text-[var(--color-graphite)] hover:text-[var(--color-navy)] transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          <Play size={16} /> Wróć do nauki wcześniej
        </button>
      </motion.div>
    </motion.div>
  )
}


export type StudyGoal = 'oral' | 'written' | 'other'

export function getWeightedShuffle(cards: Card[], unlearnedWeight = 3): Card[] {
  return [...cards].sort((a, b) => {
    const weightA = a.learned ? 1 : unlearnedWeight
    const weightB = b.learned ? 1 : unlearnedWeight
    const keyA = Math.pow(Math.random(), 1 / weightA)
    const keyB = Math.pow(Math.random(), 1 / weightB)
    return keyB - keyA
  })
}

export default function StudyMode({
  deckId,
  initialCards,
}: {
  deckId: string
  initialCards: Card[]
}) {
  const [studyState, setStudyState] = useState<StudyState>(() => {
    if (typeof window !== 'undefined') {
      const sessionStr = sessionStorage.getItem(`active_session_${deckId}`)
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr)
          const elapsed = Math.floor((Date.now() - session.startedAt) / 1000)
          if (elapsed < session.maxDuration) {
            return session.phase
          } else {
            sessionStorage.removeItem(`active_session_${deckId}`)
          }
        } catch (e) {}
      }
    }
    return 'setup'
  })
  
  const [studyType, setStudyType] = useState<StudyType>(() => {
    if (typeof window !== 'undefined') {
      const sessionStr = sessionStorage.getItem(`active_session_${deckId}`)
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr)
          const elapsed = Math.floor((Date.now() - session.startedAt) / 1000)
          if (elapsed < session.maxDuration) {
            return session.mode
          }
        } catch (e) {}
      }
    }
    return 'standard'
  })
  
  const [sessionStartedAt, setSessionStartedAt] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const sessionStr = sessionStorage.getItem(`active_session_${deckId}`)
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr)
          const elapsed = Math.floor((Date.now() - session.startedAt) / 1000)
          if (elapsed < session.maxDuration) {
            return session.startedAt
          }
        } catch (e) {}
      }
    }
    return Date.now()
  })

  const navigateStudy = (newPhase: StudyState, newMode: StudyType, overrideDuration?: number) => {
    setStudyState(newPhase)
    setStudyType(newMode)
    
    if (newPhase === 'setup') {
      sessionStorage.removeItem(`active_session_${deckId}`)
    } else {
      let startedAt = Date.now()
      let maxDuration = overrideDuration !== undefined ? overrideDuration : Number.MAX_SAFE_INTEGER

      // Jeśli zmieniamy tylko tryb (np. z standard na exam) w trakcie tej samej fazy (nauka/przerwa), 
      // i nie podaliśmy nowego limitu czasu, chcemy zachować istniejący zegar.
      if (overrideDuration === undefined && typeof window !== 'undefined') {
        const existingStr = sessionStorage.getItem(`active_session_${deckId}`)
        if (existingStr) {
          try {
            const existing = JSON.parse(existingStr)
            if (existing.phase === newPhase) {
              startedAt = existing.startedAt
              maxDuration = existing.maxDuration
            }
          } catch (e) {}
        }
      }

      setSessionStartedAt(startedAt)
      sessionStorage.setItem(`active_session_${deckId}`, JSON.stringify({
        phase: newPhase,
        mode: newMode,
        startedAt: startedAt,
        maxDuration: maxDuration
      }))
    }
  }

  const [cards, setCards] = useState<Card[]>(initialCards)
  const [studyGoal, setStudyGoal] = useState<StudyGoal>('written')
  
  // Shared state for Standard and Exam modes
  const [sharedCards, setSharedCards] = useState<Card[]>(() => getWeightedShuffle(initialCards))
  const [sharedIndex, setSharedIndex] = useState(0)
  
  const [isSessionFinished, setIsSessionFinished] = useState(false)
  
  const handleSwitchMode = (mode: StudyType) => {
    navigateStudy(studyState, mode)
    setIsSessionFinished(false)
  }

  const [pomodoroEnabled, setPomodoroEnabled] = useState(false)
  const [studyTimeMinutes, setStudyTimeMinutes] = useState(25)
  const [breakTimeMinutes, setBreakTimeMinutes] = useState(5)

  useEffect(() => {
    const saved = localStorage.getItem('pomodoroSettings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setTimeout(() => {
          setPomodoroEnabled(parsed.enabled)
          if (parsed.studyTime) setStudyTimeMinutes(parsed.studyTime)
          if (parsed.breakTime) setBreakTimeMinutes(parsed.breakTime)
        }, 0)
      } catch {}
    }
  }, [])

  const saveSettings = (enabled: boolean, study: number, breakT: number) => {
    localStorage.setItem('pomodoroSettings', JSON.stringify({ enabled, studyTime: study, breakTime: breakT }))
  }

  const supabase = createClient()

  const handleCardLearned = (cardId: string, learned: boolean) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, learned } : c))
    )
    
    // Also update the shared cards so the current run reflects the change immediately
    setSharedCards((prev) => 
      prev.map((c) => (c.id === cardId ? { ...c, learned } : c))
    )
    
    supabase.from('cards').update({ learned }).eq('id', cardId).then()
  }

  const startStudying = async () => {
    navigateStudy('studying', studyType, pomodoroEnabled ? studyTimeMinutes * 60 : Number.MAX_SAFE_INTEGER)
    supabase.from('decks').update({ last_studied_at: new Date().toISOString() }).eq('id', deckId).then()
  }

  return (
    <>
      {/* Setup UI */}
      <div className={studyState === 'setup' ? "flex flex-col gap-6 items-center w-full max-w-md mx-auto mt-4 sm:mt-10" : "hidden"}>
        <h2 className="text-2xl font-serif text-[var(--color-navy)] font-bold">Rozpocznij naukę</h2>
        
        {/* Study Goal selection */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <h3 className="font-semibold text-[var(--color-navy)] text-sm uppercase tracking-wider">Uczysz się na:</h3>
          <div className="flex flex-col gap-2">
            {[
              { id: 'oral', label: 'Egzamin ustny / obrona (sugerowane losowanie)' },
              { id: 'written', label: 'Egzamin pisemny / test' },
              { id: 'other', label: 'Coś innego' }
            ].map(goal => (
              <label key={goal.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input 
                  type="radio" 
                  name="studyGoal" 
                  checked={studyGoal === goal.id}
                  onChange={() => {
                    setStudyGoal(goal.id as StudyGoal)
                    if (goal.id === 'oral') handleSwitchMode('defense')
                    else if (goal.id === 'written') handleSwitchMode('exam')
                    else handleSwitchMode('standard')
                  }}
                  className="w-4 h-4 text-[var(--color-gold)] focus:ring-[var(--color-gold)]"
                />
                <span className="text-sm font-medium text-[var(--color-navy)]">{goal.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mode selection */}
        {studyGoal !== 'oral' && (
          <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
            <h3 className="font-semibold text-[var(--color-navy)] text-sm uppercase tracking-wider">Wybierz tryb</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleSwitchMode('standard')}
                className={`flex-1 py-3 rounded-xl border-2 transition-all font-medium text-sm ${studyType === 'standard' ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white' : 'border-gray-100 text-[var(--color-graphite)] hover:border-gray-200'}`}
              >
                Przeglądanie
              </button>
              <button 
                onClick={() => handleSwitchMode('exam')}
                className={`flex-1 py-3 rounded-xl border-2 transition-all font-medium text-sm ${studyType === 'exam' ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white' : 'border-gray-100 text-[var(--color-graphite)] hover:border-gray-200'}`}
              >
                Losowanie
              </button>
            </div>
          </div>
        )}

        {/* Pomodoro Settings */}
        {studyGoal !== 'oral' && (
          <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 overflow-hidden">
            <div className="flex justify-between items-center">
              <div>
              <h3 className="font-semibold text-[var(--color-navy)] text-sm uppercase tracking-wider">Tryb Skupienia</h3>
              <p className="text-xs text-[var(--color-graphite)] mt-1">Technika Pomodoro</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={pomodoroEnabled} onChange={(e) => {
                setPomodoroEnabled(e.target.checked)
                saveSettings(e.target.checked, studyTimeMinutes, breakTimeMinutes)
              }} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-gold)]"></div>
            </label>
          </div>

          <AnimatePresence>
            {pomodoroEnabled && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden flex flex-col gap-4"
              >
                <div className="pt-4 border-t border-gray-100 mt-2">
                  <label className="text-xs font-semibold text-[var(--color-graphite)] mb-2 block">Czas nauki (min)</label>
                  <div className="flex gap-2">
                    {[15, 25, 45].map(t => (
                      <button 
                        key={t}
                        onClick={() => { setStudyTimeMinutes(t); saveSettings(pomodoroEnabled, t, breakTimeMinutes) }}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${studyTimeMinutes === t ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--color-graphite)] mb-2 block">Czas przerwy (min)</label>
                  <div className="flex gap-2">
                    {[5, 10, 15].map(t => (
                      <button 
                        key={t}
                        onClick={() => { setBreakTimeMinutes(t); saveSettings(pomodoroEnabled, studyTimeMinutes, t) }}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${breakTimeMinutes === t ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        )}

        <button 
          onClick={startStudying}
          className="w-full bg-[var(--color-navy)] text-white py-3.5 rounded-xl font-medium shadow-[0_4px_14px_rgba(25,32,46,0.25)] hover:bg-[var(--color-navy)]/90 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
        >
          Rozpocznij naukę
        </button>
      </div>

      {/* Active Study UI */}
      <div className={studyState !== 'setup' ? "flex-1 flex flex-col relative min-h-0" : "hidden"}>
        {studyType === 'defense' ? (
          <StudyModeDefense
            deckId={deckId}
            cards={cards}
            onSwitchMode={handleSwitchMode}
            currentMode={studyType}
            studyGoal={studyGoal}
            onFinish={() => setIsSessionFinished(true)}
          />
        ) : studyType === 'exam' ? (
          <StudyModeExam
            deckId={deckId}
            cards={sharedCards}
            currentIndex={sharedIndex}
            setCards={setSharedCards}
            setCurrentIndex={setSharedIndex}
            onCardLearned={handleCardLearned}
            onSwitchMode={handleSwitchMode}
            currentMode={studyType}
            studyGoal={studyGoal}
            onFinish={() => setIsSessionFinished(true)}
            onRestart={() => setIsSessionFinished(false)}
          />
        ) : (
          <StudyModeStandard
            deckId={deckId}
            cards={sharedCards}
            currentIndex={sharedIndex}
            setCurrentIndex={setSharedIndex}
            onSwitchMode={handleSwitchMode}
            currentMode={studyType}
            studyGoal={studyGoal}
          />
        )}
      
      {studyGoal !== 'oral' && pomodoroEnabled && studyState === 'studying' && !isSessionFinished && (
        <PomodoroOverlay key="overlay" initialTime={studyTimeMinutes * 60} startedAt={sessionStartedAt} onTimeUp={() => navigateStudy('break', studyType, breakTimeMinutes * 60)} />
      )}
      
      <AnimatePresence>
        {studyGoal !== 'oral' && studyState === 'break' && (
          <StudyBreakScreen key="break" breakTimeMinutes={breakTimeMinutes} startedAt={sessionStartedAt} onEndBreak={() => navigateStudy('studying', studyType, pomodoroEnabled ? studyTimeMinutes * 60 : Number.MAX_SAFE_INTEGER)} />
        )}
      </AnimatePresence>
    </div>
    </>
  )
}
