'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, RefreshCcw, Save, Trash2, Plus, BookOpen, ArrowRight, ArrowLeft, Upload, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { saveDeck } from '@/app/decks/new/actions'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/Button'
import { createClient } from '@/utils/supabase/client'

type Card = { question: string, answer: string }
type Step = 'subject' | 'method' | 'camera' | 'preview' | 'text' | 'loading' | 'edit'

export default function Scanner() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [step, setStep] = useState<Step>('subject')
  const [subject, setSubject] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [textInput, setTextInput] = useState('')
  const [cards, setCards] = useState<Card[]>([])
  const [noteImages, setNoteImages] = useState<string[]>([])
  const [error, setError] = useState('')
  const [title, setTitle] = useState('Nowy zestaw fiszek')
  const [isSaving, setIsSaving] = useState(false)
  
  const router = useRouter()

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera access denied or unavailable', err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
  }

  useEffect(() => {
    if (step === 'camera') {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [step])

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    
    let width = video.videoWidth
    let height = video.videoHeight
    if (width > 1600) {
      height = Math.round((height * 1600) / width)
      width = 1600
    }
    
    canvas.width = width
    canvas.height = height
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      setPhoto(dataUrl)
      setStep('preview')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height
        if (width > 1600) {
          height = Math.round((height * 1600) / width)
          width = 1600
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          setPhoto(canvas.toDataURL('image/jpeg', 0.8))
        } else {
          setPhoto(dataUrl)
        }
        setStep('preview')
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  const parseImage = async () => {
    if (!photo) return
    setStep('loading')
    setError('')
    
    try {
      const res = await fetch('/api/parse-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: photo, subject: subject.trim() })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Wystąpił błąd')
      
      setCards((prev) => [...prev, ...data.cards])
      setNoteImages((prev) => [...prev, photo]) // Save image for uploading later
      if (subject.trim() && title === 'Nowy zestaw fiszek') {
        setTitle(`Zestaw: ${subject.trim()}`)
      }
      setStep('edit')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
      setStep('preview')
    }
  }

  const parseText = async () => {
    if (!textInput.trim()) return
    setStep('loading')
    setError('')
    
    try {
      const res = await fetch('/api/parse-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput.trim(), subject: subject.trim() })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Wystąpił błąd')
      
      setCards((prev) => [...prev, ...data.cards])
      if (subject.trim() && title === 'Nowy zestaw fiszek') {
        setTitle(`Zestaw: ${subject.trim()}`)
      }
      setStep('edit')
      setTextInput('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
      setStep('text')
    }
  }

  const handleSave = async () => {
    if (cards.length === 0) return
    setIsSaving(true)
    try {
      const uploadedUrls: string[] = []
      
      if (noteImages.length > 0) {
        const supabase = createClient()
        for (let i = 0; i < noteImages.length; i++) {
          try {
            const base64Data = noteImages[i].split(',')[1]
            const mime = noteImages[i].split(',')[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
            
            // Konwersja base64 -> Blob
            const byteCharacters = atob(base64Data)
            const byteArrays = []
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
              const slice = byteCharacters.slice(offset, offset + 512)
              const byteNumbers = new Array(slice.length)
              for (let j = 0; j < slice.length; j++) {
                byteNumbers[j] = slice.charCodeAt(j)
              }
              byteArrays.push(new Uint8Array(byteNumbers))
            }
            const blob = new Blob(byteArrays, { type: mime })
            
            const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.jpg`
            
            const { data, error } = await supabase.storage
              .from('deck-images')
              .upload(filename, blob, {
                contentType: mime
              })
              
            if (error) {
              console.error('Błąd wgrywania zdjęcia', error)
            } else if (data) {
              const { data: publicUrlData } = supabase.storage
                .from('deck-images')
                .getPublicUrl(data.path)
                
              if (publicUrlData) {
                uploadedUrls.push(publicUrlData.publicUrl)
              }
            }
          } catch (uploadErr) {
            console.error('Failed to upload image part', uploadErr)
          }
        }
      }

      const deckId = await saveDeck(title, cards, subject.trim(), uploadedUrls)
      router.push(`/decks/${deckId}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
      setIsSaving(false)
    }
  }

  const updateCard = (index: number, field: keyof Card, value: string) => {
    const newCards = [...cards]
    newCards[index][field] = value
    setCards(newCards)
  }

  const removeCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index))
  }

  const addCard = () => {
    setCards([...cards, { question: '', answer: '' }])
  }

  return (
    <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {step === 'subject' && (
          <motion.div
            key="subject"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center"
          >
            <div className="w-full max-w-md flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-navy)] text-white flex items-center justify-center mb-5 shadow-xs">
                <BookOpen className="w-7 h-7 text-[var(--color-gold)]" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-navy)] tracking-tight mb-2">
                Jaki to przedmiot?
              </h2>
              <p className="text-[var(--color-graphite)] text-sm mb-8 leading-relaxed max-w-sm">
                Podaj przedmiot lub zagadnienie, aby sztuczna inteligencja precyzyjnie dobrała terminologię i pojęcia na fiszkach.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (subject.trim()) {
                    setStep('method')
                  }
                }}
                className="w-full flex flex-col gap-4 text-left"
              >
                <div className="flex flex-col gap-1.5">
                  <label 
                    htmlFor="subject-input" 
                    className="text-xs font-semibold text-[var(--color-navy)] uppercase tracking-wider"
                  >
                    Przedmiot <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject-input"
                    type="text"
                    required
                    autoFocus
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="np. Biologia, Prawo rzymskie, Historia"
                    className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]/15 focus:border-[var(--color-navy)] transition-all text-sm bg-white text-[var(--color-navy)] placeholder:text-[var(--color-graphite)]/40 font-medium"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full gap-2 mt-2 group"
                  disabled={!subject.trim()}
                >
                  <span>Dalej</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'method' && (
          <motion.div
            key="method"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center relative"
          >
            <button
              type="button"
              onClick={() => setStep('subject')}
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
                onClick={() => setStep('camera')}
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
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Paste Text */}
              <button
                onClick={() => setStep('text')}
                className="flex flex-col items-center text-center p-6 rounded-2xl border-2 border-gray-100 hover:border-[var(--color-gold)]/50 hover:bg-amber-50/30 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-[var(--color-gold)]/20 text-[var(--color-navy)] group-hover:text-[var(--color-gold)] flex items-center justify-center mb-4 transition-colors">
                  <FileText size={24} />
                </div>
                <h3 className="font-bold text-[var(--color-navy)] mb-1">Wklej tekst</h3>
                <p className="text-xs text-[var(--color-graphite)] leading-relaxed">Skopiuj i wklej fragment podręcznika lub notatek.</p>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'text' && (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 relative"
          >
            <div className="w-full max-w-3xl flex flex-col h-full pt-12 sm:pt-4">
              <button
                type="button"
                onClick={() => setStep('method')}
                className="absolute top-4 left-4 z-20 px-3.5 py-2.5 min-h-[44px] rounded-full bg-gray-100 text-[var(--color-navy)] text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-200 cursor-pointer transition-colors"
              >
                <ArrowLeft size={16} />
                Wróć
              </button>
              
              <div className="flex flex-col items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-[var(--color-navy)]">
                  Wklej notatki
                </h2>
                <p className="text-[var(--color-graphite)] text-sm mt-1 text-center">
                  Wklej poniżej fragment tekstu (np. artykuł, notatki), aby zamienić go na fiszki.
                </p>
              </div>
              
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Wklej tekst tutaj..."
                className="flex-1 min-h-[300px] w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-[var(--color-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]/15 focus:border-[var(--color-navy)] transition-all resize-none mb-4"
              />
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-[var(--color-brick)] text-sm rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <Button
                onClick={parseText}
                variant="primary"
                size="lg"
                disabled={!textInput.trim()}
                className="w-full shrink-0"
              >
                Wygeneruj fiszki z tekstu
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'camera' && (
          <motion.div 
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col bg-black relative"
          >
            <button
              type="button"
              onClick={() => setStep('method')}
              className="absolute top-4 left-4 z-20 px-3.5 py-2.5 min-h-[44px] rounded-full bg-black/50 backdrop-blur-md text-white/90 text-xs font-semibold flex items-center gap-1.5 hover:bg-black/70 cursor-pointer transition-colors border border-white/10"
            >
              <ArrowLeft size={16} />
              Wróć
            </button>

            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
              <div className="w-full max-w-sm aspect-[3/4] border-2 border-dashed border-white/50 rounded-2xl relative">
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[var(--color-gold)] rounded-tl-2xl"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[var(--color-gold)] rounded-tr-2xl"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[var(--color-gold)] rounded-bl-2xl"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[var(--color-gold)] rounded-br-2xl"></div>
              </div>
            </div>
            
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col items-center gap-5 sm:gap-6 bg-gradient-to-t from-black/85 via-black/45 to-transparent">
              <button 
                onClick={takePhoto}
                aria-label="Zrób zdjęcie"
                className="w-20 h-20 bg-white/20 rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:bg-white/40 transition-colors duration-200 active:scale-95"
              >
                <div className="w-16 h-16 bg-white rounded-full"></div>
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}

        {step === 'preview' && (
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
                onClick={() => setStep('method')}
                className="flex-1 py-3.5 min-h-[44px] bg-white/20 text-white rounded-xl font-medium backdrop-blur-md cursor-pointer transition-transform duration-[160ms] active:scale-[0.97] border border-white/10 flex items-center justify-center"
              >
                Anuluj
              </button>
              <button 
                onClick={parseImage}
                className="flex-1 py-3.5 min-h-[44px] bg-[var(--color-gold)] text-white rounded-xl font-medium cursor-pointer transition-transform duration-[160ms] active:scale-[0.97] flex items-center justify-center"
              >
                Użyj tego
              </button>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
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
              <RefreshCcw className="w-12 h-12 text-[var(--color-gold)]" />
            </motion.div>
            
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <h2 className="text-2xl font-serif font-bold text-[var(--color-navy)] tracking-tight">Analizowanie materiału...</h2>
              <p className="text-[var(--color-graphite)] mt-3">To może zająć kilkanaście sekund. Sztuczna inteligencja wyciąga pytania i odpowiedzi.</p>
            </motion.div>
          </motion.div>
        )}

        {step === 'edit' && (
          <motion.div 
            key="edit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="flex-1 flex flex-col overflow-hidden bg-white"
          >
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white sticky top-0 z-10">
              <div className="flex-1 flex items-center gap-2.5 w-full min-w-0">
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 text-2xl font-serif font-bold text-[var(--color-navy)] bg-transparent focus:outline-none border-b border-transparent focus:border-[var(--color-gold)] px-1 py-1 transition-colors min-w-0"
                />
                {subject && (
                  <span className="shrink-0 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-900/80">
                    {subject}
                  </span>
                )}
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-[var(--color-navy)] text-white px-6 py-2.5 min-h-[44px] rounded-xl font-medium text-sm transition-all duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97] disabled:opacity-50 cursor-pointer shrink-0 w-full sm:w-auto"
              >
                {isSaving ? 'Zapisywanie...' : <><Save size={18} /> Zapisz</>}
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/50">
              {error && (
                <div className="p-3 bg-red-50 text-[var(--color-brick)] text-sm rounded-xl border border-red-100">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {cards.map((card, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                      layout
                      className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100/80 rounded-2xl p-5 relative group"
                    >
                      <button 
                        onClick={() => removeCard(index)}
                        aria-label="Usuń fiszkę"
                        className="absolute top-3 right-3 text-gray-400 hover:text-[var(--color-brick)] transition-colors cursor-pointer active:scale-90 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        <Trash2 size={20} />
                      </button>
                      
                      <div className="space-y-4 mr-8">
                        <div>
                          <label className="text-xs font-semibold text-[var(--color-graphite)] uppercase tracking-wider">Pytanie</label>
                          <textarea 
                            value={card.question}
                            onChange={(e) => updateCard(index, 'question', e.target.value)}
                            className="w-full mt-1.5 bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-[var(--color-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30 focus:border-[var(--color-gold)] transition-all duration-200"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-[var(--color-graphite)] uppercase tracking-wider">Odpowiedź</label>
                          <textarea 
                            value={card.answer}
                            onChange={(e) => updateCard(index, 'answer', e.target.value)}
                            className="w-full mt-1.5 bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-[var(--color-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30 focus:border-[var(--color-gold)] transition-all duration-200"
                            rows={2}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <motion.div layout className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <button 
                  onClick={addCard}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[44px] border-2 border-dashed border-gray-200 text-[var(--color-graphite)] rounded-2xl hover:bg-white hover:border-gray-300 transition-colors cursor-pointer text-sm font-medium active:scale-[0.98]"
                >
                  <Plus size={18} /> Dodaj pustą fiszkę
                </button>
                <button 
                  onClick={() => {
                    setStep('method')
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[44px] border border-gray-200 bg-white text-[var(--color-navy)] rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium shadow-[0_2px_10px_rgb(0,0,0,0.02)] active:scale-[0.98]"
                >
                  <BookOpen size={18} /> Dodaj kolejną stronę / tekst
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
