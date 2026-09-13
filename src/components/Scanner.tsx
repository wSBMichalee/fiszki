'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveDeck } from '@/app/decks/new/actions'
import { AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { Card, Step } from './scanner/types'

import SubjectStep from './scanner/SubjectStep'
import MethodStep from './scanner/MethodStep'
import CameraStep from './scanner/CameraStep'
import PreviewStep from './scanner/PreviewStep'
import TextInputStep from './scanner/TextInputStep'
import LoadingStep from './scanner/LoadingStep'
import EditStep from './scanner/EditStep'

export default function Scanner() {
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
          <SubjectStep 
            subject={subject} 
            setSubject={setSubject} 
            onNext={() => setStep('method')} 
          />
        )}

        {step === 'method' && (
          <MethodStep 
            subject={subject} 
            onBack={() => setStep('subject')} 
            onSelectCamera={() => setStep('camera')} 
            onSelectText={() => setStep('text')} 
            onFileUpload={handleFileUpload} 
          />
        )}

        {step === 'text' && (
          <TextInputStep 
            textInput={textInput} 
            setTextInput={setTextInput} 
            error={error} 
            onBack={() => setStep('method')} 
            onParseText={parseText} 
          />
        )}

        {step === 'camera' && (
          <CameraStep 
            onBack={() => setStep('method')} 
            onCapture={(dataUrl) => {
              setPhoto(dataUrl)
              setStep('preview')
            }} 
          />
        )}

        {step === 'preview' && (
          <PreviewStep 
            photo={photo} 
            onBack={() => setStep('method')} 
            onParseImage={parseImage} 
          />
        )}

        {step === 'loading' && (
          <LoadingStep />
        )}

        {step === 'edit' && (
          <EditStep 
            cards={cards} 
            title={title} 
            setTitle={setTitle} 
            subject={subject} 
            error={error} 
            isSaving={isSaving} 
            onSave={handleSave} 
            onAddMoreText={() => setStep('method')} 
            onUpdateCard={updateCard} 
            onRemoveCard={removeCard} 
            onAddCard={addCard} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

