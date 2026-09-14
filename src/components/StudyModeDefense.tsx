'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from './StudyMode'
import { Mic, Square, Check, X, AlertTriangle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any
  }
}

type DefenseResult = {
  card: Card
  transcript: string
  reactionTimeSeconds: number
  speakingDurationSeconds: number
  isSufficient: boolean
  missingElements: string | null
  justification: string
  confidence: 'Wysoka' | 'Średnia' | 'Niska'
  isTextFallback?: boolean
}

type Step = 'intro' | 'shuffling' | 'question' | 'recording' | 'evaluating' | 'summary'

export default function StudyModeDefense({
  cards,
  onSwitchMode,
  currentMode,
  onFinish
}: {
  deckId: string
  cards: Card[]
  onSwitchMode: (mode: 'standard' | 'exam' | 'defense') => void
  currentMode: 'standard' | 'exam' | 'defense'
  studyGoal: string
  onFinish?: () => void
}) {
  const [defenseCards] = useState<Card[]>(() => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(3, shuffled.length))
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [step, setStep] = useState<Step>('intro')
  
  const [results, setResults] = useState<DefenseResult[]>([])
  
  const [transcript, setTranscript] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showFallback, setShowFallback] = useState(() => {
    if (typeof window !== 'undefined') {
      return !(window.SpeechRecognition || window.webkitSpeechRecognition)
    }
    return false
  })
  const [textFallback, setTextFallback] = useState('')
  
  // Timing refs
  const questionShownAt = useRef<number>(0)
  const startedSpeakingAt = useRef<number>(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !showFallback) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'pl-PL' // default polish

        recognitionRef.current.onstart = () => {
          setIsRecording(true)
          if (startedSpeakingAt.current === 0) {
            startedSpeakingAt.current = Date.now()
          }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = ''
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript
          }
          setTranscript(currentTranscript)
          
          if (startedSpeakingAt.current === 0) {
            startedSpeakingAt.current = Date.now()
          }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error)
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setShowFallback(true)
            setIsRecording(false)
          }
        }

        recognitionRef.current.onend = () => {
          setIsRecording(false)
        }
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startExam = () => {
    setStep('shuffling')
  }

  const startQuestion = () => {
    setStep('question')
    setTranscript('')
    setTextFallback('')
    questionShownAt.current = Date.now()
    startedSpeakingAt.current = 0
  }

  const startRecording = () => {
    if (showFallback) return
    try {
      recognitionRef.current?.start()
      setStep('recording')
    } catch (e) {
      console.error(e)
      setShowFallback(true)
    }
  }
  
  const useFallbackMode = () => {
    setShowFallback(true)
    // keep step as 'question' to show textarea
  }

  const stopRecordingAndEvaluate = async () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
    setStep('evaluating')
    
    const finalTranscript = showFallback ? textFallback : transcript
    const reactionTime = showFallback ? 1 : (startedSpeakingAt.current > 0 ? (startedSpeakingAt.current - questionShownAt.current) / 1000 : 0)
    const speakingDuration = (Date.now() - (startedSpeakingAt.current || Date.now())) / 1000

    // Ocenianie Pewności (Confidence)
    // Szybka reakcja (< 3s) i dobre tempo mówienia = wysoka pewność
    const wordCount = finalTranscript.trim().split(/\s+/).filter(w => w.length > 0).length
    const wpm = speakingDuration > 0 ? (wordCount / (speakingDuration / 60)) : 0
    
    let confidence: 'Wysoka' | 'Średnia' | 'Niska' = 'Średnia'
    if (showFallback) {
      confidence = 'Średnia' //Fallback nie ma sensownego pomiaru mówienia
    } else {
      if (reactionTime < 4 && wpm > 80) confidence = 'Wysoka'
      else if (reactionTime > 8 || wpm < 50) confidence = 'Niska'
    }

    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: defenseCards[currentIndex].question,
          expectedAnswer: defenseCards[currentIndex].answer,
          transcript: finalTranscript
        })
      })
      
      const data = await res.json()
      
      const newResult: DefenseResult = {
        card: defenseCards[currentIndex],
        transcript: finalTranscript,
        reactionTimeSeconds: reactionTime,
        speakingDurationSeconds: speakingDuration,
        isSufficient: data.isSufficient ?? false,
        missingElements: data.missingElements || null,
        justification: data.justification || 'Brak oceny',
        confidence,
        isTextFallback: showFallback
      }
      
      setResults(prev => [...prev, newResult])
      
      if (currentIndex < defenseCards.length - 1) {
        setCurrentIndex(prev => prev + 1)
        startQuestion()
      } else {
        setStep('summary')
        onFinish?.()
      }
      
    } catch (err) {
      console.error(err)
      // Awaryjnie zalicz jak błąd
      setResults(prev => [...prev, {
        card: defenseCards[currentIndex],
        transcript: finalTranscript,
        reactionTimeSeconds: reactionTime,
        speakingDurationSeconds: speakingDuration,
        isSufficient: false,
        missingElements: 'Wystąpił błąd podczas połączenia z AI.',
        justification: 'Błąd',
        confidence: 'Niska',
        isTextFallback: showFallback
      }])
      
      if (currentIndex < defenseCards.length - 1) {
        setCurrentIndex(prev => prev + 1)
        startQuestion()
      } else {
        setStep('summary')
        onFinish?.()
      }
    }
  }

  if (step === 'intro') {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-gray-100 text-center"
        >
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mic className="text-[var(--color-gold)]" size={32} />
          </div>
          <h2 className="text-2xl font-serif text-[var(--color-navy)] font-bold mb-4">Tryb Obrony</h2>
          <p className="text-[var(--color-graphite)] mb-6 text-sm leading-relaxed">
            Ten tryb wylosuje <strong>{defenseCards.length} pytania</strong>. 
            Twoim zadaniem będzie odpowiedzieć na nie <strong>na głos</strong>. 
            Sztuczna Inteligencja przeanalizuje Twoją odpowiedź pod kątem merytorycznym i płynności.
          </p>
          <Button onClick={startExam} className="w-full" size="lg">
            Rozpocznij egzamin
          </Button>
          <button onClick={() => onSwitchMode('standard')} className="mt-4 text-xs font-medium text-gray-400 hover:text-gray-600">
            Wróć do normalnej nauki
          </button>
        </motion.div>
      </div>
    )
  }

  if (step === 'summary') {
    const passedCount = results.filter(r => r.isSufficient).length
    const isPassed = passedCount >= Math.ceil(defenseCards.length / 2)
    
    return (
      <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
        <div className="max-w-3xl w-full mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-8 rounded-3xl mb-8 text-center shadow-sm border ${isPassed ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}
          >
            <h2 className={`text-3xl font-serif font-bold mb-2 ${isPassed ? 'text-emerald-800' : 'text-red-800'}`}>
              {isPassed ? 'Egzamin Zdalny!' : 'Jeszcze nie tym razem'}
            </h2>
            <p className={`font-medium ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
              Zaliczone pytania: {passedCount} z {defenseCards.length}
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {results.map((res, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h3 className="font-semibold text-[var(--color-navy)] text-lg leading-snug">
                    <span className="text-gray-400 mr-2">{i + 1}.</span> 
                    {res.card.question}
                  </h3>
                  <div className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 ${res.isSufficient ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {res.isSufficient ? <Check size={14}/> : <X size={14}/>}
                    {res.isSufficient ? 'Zaliczone' : 'Błąd'}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-[var(--color-graphite)] italic border border-gray-100">
                  &quot;{res.transcript || '(brak wypowiedzi)'}&quot;
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className={`bg-white border border-gray-200 rounded-xl p-3 ${res.isTextFallback ? 'col-span-1 sm:col-span-2' : ''}`}>
                    <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Ocena AI</div>
                    <p className="text-sm text-[var(--color-navy)]">{res.justification}</p>
                    {res.missingElements && (
                      <p className="text-xs text-red-600 mt-2 font-medium">Zabrakło: {res.missingElements}</p>
                    )}
                  </div>
                  
                  {!res.isTextFallback && (
                    <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col justify-center">
                      <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Wskaźnik Pewności*</div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${res.confidence === 'Wysoka' ? 'bg-emerald-500' : res.confidence === 'Średnia' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-semibold text-[var(--color-navy)]">{res.confidence}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-2 leading-tight">
                        * Szacunek oparty na tempie i płynności (nie jest to pomiar medyczny ani psychologiczny).
                      </div>
                    </div>
                  )}
                </div>
                
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 flex justify-center">
            <Button onClick={() => onSwitchMode('standard')} variant="secondary" size="lg">
              Zakończ i wróć
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-[60vh] min-h-[400px] max-h-[600px]">
        {/* Header progress */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Pytanie {currentIndex + 1} z {defenseCards.length}
          </span>
          
          <div className="flex bg-white p-0.5 rounded-full border border-gray-200 shadow-xs">
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
        </div>

        {/* Content */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center relative overflow-y-auto custom-scrollbar">
          
          {step === 'shuffling' ? (
            <ShufflingAnimation 
              onComplete={startQuestion} 
              onSkip={startQuestion} 
            />
          ) : step === 'evaluating' ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center"
            >
              <Loader2 className="w-12 h-12 text-[var(--color-gold)] animate-spin mb-4" />
              <h3 className="text-xl font-serif text-[var(--color-navy)] font-bold">Analizowanie odpowiedzi...</h3>
              <p className="text-sm text-gray-500 mt-2">Sztuczna inteligencja sprawdza poprawność merytoryczną.</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full flex flex-col items-center min-h-full py-4"
              >
                <h2 className={`font-serif text-[var(--color-navy)] font-bold mb-10 leading-snug whitespace-pre-line w-full ${defenseCards[currentIndex]?.question.length > 120 ? 'text-left text-xl sm:text-2xl' : 'text-center text-2xl sm:text-3xl'}`}>
                  {defenseCards[currentIndex]?.question}
                </h2>

                {step === 'question' && !showFallback && (
                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={startRecording}
                      className="w-20 h-20 bg-[var(--color-navy)] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                      <Mic size={32} />
                    </button>
                    <span className="text-sm font-medium text-gray-500">Kliknij, aby odpowiedzieć na głos</span>
                    <button onClick={useFallbackMode} className="text-xs text-gray-400 underline mt-4">
                      Mam problem z mikrofonem
                    </button>
                  </div>
                )}
                
                {step === 'question' && showFallback && (
                  <div className="w-full flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg text-xs font-medium mb-2">
                      <AlertTriangle size={14} />
                      Brak dostępu do mikrofonu (tryb tekstowy)
                    </div>
                    <textarea 
                      value={textFallback}
                      onChange={(e) => setTextFallback(e.target.value)}
                      placeholder="Wpisz swoją odpowiedź tutaj..."
                      className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-navy)] focus:border-transparent resize-none text-sm"
                    />
                    <Button onClick={stopRecordingAndEvaluate} disabled={!textFallback.trim()} className="w-full">
                      Gotowe, sprawdź
                    </Button>
                  </div>
                )}

                {step === 'recording' && !showFallback && (
                  <div className="w-full flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                      <button
                        onClick={stopRecordingAndEvaluate}
                        className="relative w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 active:scale-95 transition-all"
                      >
                        <Square size={28} className="fill-current" />
                      </button>
                    </div>
                    
                    <div className="w-full max-w-md bg-gray-50 rounded-xl p-4 min-h-[80px] border border-gray-100 text-center">
                      <p className={`text-sm ${transcript ? 'text-[var(--color-navy)]' : 'text-gray-400 italic'}`}>
                        {transcript || 'Słucham...'}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Kliknij kwadrat, aby zakończyć
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

        </div>
      </div>
    </div>
  )
}

function ShufflingAnimation({ onComplete, onSkip }: { onComplete: () => void, onSkip: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2200)
    return () => clearTimeout(timer)
  }, [onComplete])

  const [cards] = useState(() => {
    return Array.from({ length: 7 }).map((_, i) => ({
      id: i,
      x1: (Math.random() - 0.5) * 120,
      x2: (Math.random() - 0.5) * 60,
      y1: (Math.random() - 0.5) * 80,
      y2: (Math.random() - 0.5) * 40,
      r1: (Math.random() - 0.5) * 90,
      r2: (Math.random() - 0.5) * 45,
      z: Math.floor(Math.random() * 10)
    }))
  })

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full min-h-[250px]">
      <div className="relative w-24 h-32 sm:w-32 sm:h-44">
        {cards.map((card) => {
          const isFinalThree = card.id >= 4;
          const finalIndex = card.id - 4; // 0, 1, 2
          return (
            <motion.div
              key={card.id}
              initial={{ 
                x: 0, 
                y: 0, 
                rotate: 0, 
                opacity: 0,
                scale: 0.8
              }}
              animate={{
                x: [
                  0, 
                  card.x1,
                  card.x2,
                  isFinalThree ? (finalIndex - 1) * 20 : 0
                ],
                y: [
                  0, 
                  card.y1,
                  card.y2,
                  isFinalThree ? (finalIndex * 4) : 0
                ],
                rotate: [
                  0, 
                  card.r1,
                  card.r2,
                  isFinalThree ? (finalIndex - 1) * 8 : 0
                ],
                opacity: [
                  0, 
                  1, 
                  1, 
                  isFinalThree ? 1 : 0
                ],
                scale: [0.8, 1.1, 1, 1],
                zIndex: [card.id, card.z, isFinalThree ? 10 + card.id : card.id],
              }}
              transition={{
                duration: 2.0,
                times: [0, 0.4, 0.7, 1],
                ease: "easeInOut",
              }}
              className="absolute top-0 left-0 w-full h-full bg-[#fdfdfc] border-2 border-[var(--color-navy)] rounded-xl shadow-md flex items-center justify-center overflow-hidden"
            >
              <div className="w-full h-full flex flex-col gap-2 p-3 opacity-20">
                <div className="w-full h-2 bg-[var(--color-navy)] rounded-full w-3/4"></div>
                <div className="w-full h-2 bg-[var(--color-navy)] rounded-full w-1/2"></div>
                <div className="w-full h-2 bg-[var(--color-navy)] rounded-full w-5/6"></div>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      <button 
        onClick={onSkip}
        className="absolute bottom-[-20px] right-0 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors z-20"
      >
        Pomiń
      </button>
    </div>
  )
}

