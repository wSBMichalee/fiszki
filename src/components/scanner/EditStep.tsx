'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Save, Trash2, Plus, BookOpen } from 'lucide-react'
import { Card } from './types'

interface EditStepProps {
  cards: Card[]
  title: string
  setTitle: (val: string) => void
  subject: string
  error: string
  isSaving: boolean
  onSave: () => void
  onAddMoreText: () => void
  onUpdateCard: (index: number, field: keyof Card, value: string) => void
  onRemoveCard: (index: number) => void
  onAddCard: () => void
}

export default function EditStep({
  cards,
  title,
  setTitle,
  subject,
  error,
  isSaving,
  onSave,
  onAddMoreText,
  onUpdateCard,
  onRemoveCard,
  onAddCard
}: EditStepProps) {
  return (
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
          onClick={onSave}
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
                  onClick={() => onRemoveCard(index)}
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
                      onChange={(e) => onUpdateCard(index, 'question', e.target.value)}
                      className="w-full mt-1.5 bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-[var(--color-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30 focus:border-[var(--color-gold)] transition-all duration-200"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-graphite)] uppercase tracking-wider">Odpowiedź</label>
                    <textarea 
                      value={card.answer}
                      onChange={(e) => onUpdateCard(index, 'answer', e.target.value)}
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
            onClick={onAddCard}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[44px] border-2 border-dashed border-gray-200 text-[var(--color-graphite)] rounded-2xl hover:bg-white hover:border-gray-300 transition-colors cursor-pointer text-sm font-medium active:scale-[0.98]"
          >
            <Plus size={18} /> Dodaj pustą fiszkę
          </button>
          <button 
            onClick={onAddMoreText}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[44px] border border-gray-200 bg-white text-[var(--color-navy)] rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium shadow-[0_2px_10px_rgb(0,0,0,0.02)] active:scale-[0.98]"
          >
            <BookOpen size={18} /> Dodaj kolejną stronę / tekst
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
