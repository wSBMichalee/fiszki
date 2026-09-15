'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Camera, LogOut, AlertTriangle, Loader2, ChevronDown } from 'lucide-react'
import { logout } from '@/app/login/actions'
import { deleteAccount } from '@/app/actions/deleteAccount'
import Button from './Button'

type UserData = {
  email?: string
}

type NavDeck = {
  id: string
  title: string
  subject: string | null
}

export default function HeaderNav({ user, decks = [] }: { user: UserData | null, decks?: NavDeck[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'USUŃ') return
    setIsDeleting(true)
    setDeleteError('')
    try {
      await deleteAccount()
      // Redirection is handled in the server action
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Wystąpił nieznany błąd')
      setIsDeleting(false)
    }
  }

  // Group decks by subject
  const groupedDecks = useMemo(() => {
    const groups: Record<string, NavDeck[]> = {}
    decks.forEach(deck => {
      const subject = deck.subject || 'Inne'
      if (!groups[subject]) groups[subject] = []
      groups[subject].push(deck)
    })
    return groups
  }, [decks])

  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({})

  const toggleSubject = (subject: string) => {
    setExpandedSubjects(prev => ({ ...prev, [subject]: !prev[subject] }))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    
    const handleTab = (e: KeyboardEvent) => {
      if (!isOpen || !drawerRef.current) return
      
      const focusableElements = drawerRef.current.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keydown', handleTab)
      document.body.style.overflow = 'hidden'
      
      setTimeout(() => {
        drawerRef.current?.focus()
      }, 100)
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keydown', handleTab)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const closeDrawer = () => setIsOpen(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Zamknij menu' : 'Otwórz menu'}
        aria-expanded={isOpen}
        className="relative z-50 p-2 text-[var(--color-navy)] hover:bg-black/5 rounded-xl transition-colors cursor-pointer w-11 h-11 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-navy)]/30"
      >
        <motion.div
          className="w-5 h-4 relative flex flex-col justify-between"
          initial={false}
          animate={isOpen ? 'open' : 'closed'}
        >
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: 45, y: 7 },
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-full h-0.5 bg-current rounded-full origin-center block"
          />
          <motion.span
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 },
            }}
            transition={{ duration: 0.1 }}
            className="w-full h-0.5 bg-current rounded-full block"
          />
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: -45, y: -7 },
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-full h-0.5 bg-current rounded-full origin-center block"
          />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            
            {/* Drawer */}
            <motion.div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu główne"
              tabIndex={-1}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[380px] bg-white shadow-2xl z-40 flex flex-col pt-24 px-6 pb-6 outline-none border-l border-gray-100"
            >
              {user ? (
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <p className="text-xs font-semibold text-[var(--color-graphite)] uppercase tracking-wider mb-1">Zalogowano jako</p>
                    <p className="text-[var(--color-navy)] font-medium text-lg truncate">{user.email}</p>
                  </div>
                  
                  <nav className="flex flex-col gap-2">
                    <Link 
                      href="/dashboard"
                      onClick={closeDrawer}
                      className="flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 text-[var(--color-navy)] transition-colors font-medium text-lg"
                    >
                      <Layers size={22} className="text-[var(--color-gold)]" />
                      Dashboard
                    </Link>
                    <Link 
                      href="/decks/new"
                      onClick={closeDrawer}
                      className="flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 text-[var(--color-navy)] transition-colors font-medium text-lg"
                    >
                      <Camera size={22} className="text-[var(--color-gold)]" />
                      Nowy zestaw
                    </Link>
                  </nav>

                  {Object.keys(groupedDecks).length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xs font-semibold text-[var(--color-graphite)] uppercase tracking-wider mb-3">Twoje zestawy</h3>
                      <div className="flex flex-col gap-1 overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
                        {Object.entries(groupedDecks).map(([subject, subjectDecks]) => (
                          <div key={subject} className="flex flex-col">
                            <button
                              onClick={() => toggleSubject(subject)}
                              className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 text-[var(--color-navy)] transition-colors w-full text-left font-medium"
                            >
                              <span className="truncate pr-2">{subject} <span className="text-gray-400 text-sm font-normal">({subjectDecks.length})</span></span>
                              <motion.div
                                animate={{ rotate: expandedSubjects[subject] ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown size={16} className="text-gray-400" />
                              </motion.div>
                            </button>
                            <AnimatePresence>
                              {expandedSubjects[subject] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden flex flex-col"
                                >
                                  {subjectDecks.map(deck => (
                                    <Link
                                      key={deck.id}
                                      href={`/decks/${deck.id}`}
                                      onClick={closeDrawer}
                                      className="py-2 pl-6 pr-3 ml-2 text-sm text-[var(--color-graphite)] hover:text-[var(--color-navy)] hover:bg-gray-50/80 rounded-lg truncate transition-colors border-l-2 border-gray-100 hover:border-[var(--color-gold)]"
                                    >
                                      {deck.title}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-6 pb-2 border-t border-gray-100 flex flex-col gap-4">
                    <form action={logout} onSubmit={closeDrawer} className="w-full">
                      <Button 
                        type="submit"
                        variant="danger"
                        size="md"
                        className="w-full gap-2"
                      >
                        <LogOut size={18} />
                        Wyloguj się
                      </Button>
                    </form>

                    <div className="flex justify-center">
                      <button 
                        onClick={() => {
                          setDeleteConfirmText('')
                          setDeleteError('')
                          setIsDeleteModalOpen(true)
                          closeDrawer()
                        }}
                        className="p-3 text-[11px] font-semibold text-[var(--color-graphite)] hover:text-[var(--color-brick)] hover:bg-gray-50 rounded-lg transition-colors opacity-70 hover:opacity-100 uppercase tracking-widest"
                      >
                        Usuń konto
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex flex-col gap-3 mt-4">
                    <Link 
                      href="/login"
                      onClick={closeDrawer}
                      className="w-full text-center py-4 rounded-2xl border border-gray-200 text-[var(--color-navy)] font-medium hover:bg-gray-50 transition-colors cursor-pointer block"
                    >
                      Zaloguj się
                    </Link>
                    <Link 
                      href="/login?tab=register"
                      onClick={closeDrawer}
                      className="w-full text-center py-4 rounded-2xl bg-[var(--color-navy)] text-white font-medium hover:bg-[var(--color-navy)]/90 shadow-sm transition-colors cursor-pointer block"
                    >
                      Zarejestruj się
                    </Link>
                  </div>
                  
                  <div className="mt-auto flex flex-col gap-4 text-center">
                    <div className="h-px w-full bg-gray-100 mb-2"></div>
                    <Link href="#" className="text-sm font-medium text-[var(--color-graphite)] hover:text-[var(--color-navy)] transition-colors">Kontakt</Link>
                    <Link href="#" className="text-sm font-medium text-[var(--color-graphite)] hover:text-[var(--color-navy)] transition-colors">Regulamin</Link>
                    <Link href="#" className="text-sm font-medium text-[var(--color-graphite)] hover:text-[var(--color-navy)] transition-colors">Polityka prywatności</Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col gap-4"
            >
              <div className="w-12 h-12 bg-red-50 text-[var(--color-brick)] rounded-full flex items-center justify-center mb-2">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--color-navy)]">Usuń konto</h3>
              <p className="text-sm text-[var(--color-graphite)]">
                Ta operacja jest nieodwracalna. Usunięte zostaną wszystkie Twoje zestawy, fiszki i zdjęcia notatek. Nie da się tego cofnąć.
              </p>
              
              <div className="mt-4">
                <label className="block text-xs font-semibold text-[var(--color-navy)] mb-2 uppercase tracking-wide">
                  Przepisz słowo <span className="font-bold text-[var(--color-brick)]">USUŃ</span> aby potwierdzić:
                </label>
                <input 
                  type="text" 
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition-all font-mono text-center text-lg"
                  placeholder="USUŃ"
                />
              </div>

              {deleteError && (
                <p className="text-xs font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                  {deleteError}
                </p>
              )}

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-medium text-[var(--color-graphite)] bg-white border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200 transition-all disabled:opacity-50"
                  disabled={isDeleting}
                >
                  Anuluj
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'USUŃ' || isDeleting}
                  className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-sm
                    ${deleteConfirmText === 'USUŃ' && !isDeleting
                      ? 'bg-[var(--color-brick)] text-white hover:bg-red-700 active:scale-95' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {isDeleting ? <Loader2 size={18} className="animate-spin" /> : 'Zrozumiałem, usuń'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
