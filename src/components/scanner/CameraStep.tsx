'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

interface CameraStepProps {
  onBack: () => void
  onCapture: (dataUrl: string) => void
}

export default function CameraStep({ onBack, onCapture }: CameraStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let currentStream: MediaStream | null = null

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        })
        currentStream = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('Camera access denied or unavailable', err)
      }
    }

    startCamera()

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

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
      onCapture(dataUrl)
    }
  }

  return (
    <motion.div 
      key="camera"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col bg-black relative min-h-0"
    >
      <button
        type="button"
        onClick={onBack}
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
      
      <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col items-center gap-5 sm:gap-6 bg-gradient-to-t from-black/85 via-black/45 to-transparent z-10">
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
  )
}
