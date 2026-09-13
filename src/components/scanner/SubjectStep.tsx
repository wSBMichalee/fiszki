'use client'

import { motion } from 'framer-motion'
import { BookOpen, ArrowRight } from 'lucide-react'
import Button from '@/components/Button'

interface SubjectStepProps {
  subject: string
  setSubject: (val: string) => void
  onNext: () => void
}

export default function SubjectStep({ subject, setSubject, onNext }: SubjectStepProps) {
  return (
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
              onNext()
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
  )
}
