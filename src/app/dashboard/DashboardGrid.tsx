"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Sparkles, CheckCircle2, Layers, Flame, ArrowRight } from "lucide-react";

type Deck = {
  id: string;
  title: string;
  subject?: string | null;
  created_at: string;
};

type Stats = {
  totalCards: number;
  learnedCards: number;
};

export default function DashboardGrid({ 
  decks,
  stats 
}: { 
  decks: Deck[];
  stats?: Stats;
}) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
  };

  const totalCards = stats?.totalCards ?? 0;
  const learnedCards = stats?.learnedCards ?? 0;
  const masteryPercentage = totalCards > 0 ? Math.round((learnedCards / totalCards) * 100) : 0;

  if (!decks || decks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="text-center py-20 px-6 bg-white rounded-3xl border border-gray-100 shadow-[0_12px_36px_rgba(28,43,69,0.04)]"
      >
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-gold)]/10 text-[var(--color-gold)] flex items-center justify-center mx-auto mb-5">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-[var(--color-navy)] mb-2">Twój panel jest pusty</h3>
        <p className="text-[var(--color-graphite)] mb-8 text-base max-w-sm mx-auto">
          Stwórz swój pierwszy zestaw notatek i zacznij uczyć się w mgnieniu oka.
        </p>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          <Link 
            href="/decks/new" 
            className="inline-flex items-center gap-2 bg-[var(--color-navy)] text-white px-8 py-4 rounded-2xl font-bold text-base shadow-[0_6px_0_#0f1726] active:shadow-none active:translate-y-1 transition-all"
          >
            Utwórz swój pierwszy zestaw
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Motivational Stats Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_10px_30px_rgba(28,43,69,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
      >
        {/* Subtle background flair */}
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-amber-50/50 via-transparent to-transparent pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-gold)]/10 text-xs font-bold text-[var(--color-gold)] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Panel postępów</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-navy)] tracking-tight">
            Witaj z powrotem
          </h2>
          <p className="text-[var(--color-graphite)] text-sm sm:text-base leading-relaxed">
            {masteryPercentage >= 100 && totalCards > 0
              ? "Wspaniale! Masz opanowane 100% fiszek. Czas na nowe wyzwania!"
              : "Każda krótka powtórka utrwala materiał. Wybierz zestaw i ruszaj dalej."}
          </p>
        </div>

        {/* Motivational Stats Pills */}
        <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
          <div className="flex-1 md:flex-initial bg-gray-50/90 border border-gray-100 rounded-2xl p-3.5 sm:p-4 min-w-[100px] sm:min-w-[120px] flex flex-col">
            <span className="text-xs font-semibold text-[var(--color-graphite)] flex items-center gap-1 mb-1">
              <Layers className="w-3.5 h-3.5 text-[var(--color-navy)]" />
              Zestawy
            </span>
            <span className="text-2xl font-serif font-bold text-[var(--color-navy)]">
              {decks.length}
            </span>
          </div>

          <div className="flex-1 md:flex-initial bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 sm:p-4 min-w-[120px] sm:min-w-[140px] flex flex-col">
            <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />
              Opanowane
            </span>
            <span className="text-2xl font-serif font-bold text-[var(--color-success)]">
              {learnedCards} <span className="text-sm font-sans font-medium text-emerald-700/60">/ {totalCards}</span>
            </span>
          </div>

          {totalCards > 0 && (
            <div className="hidden lg:flex flex-col bg-amber-50/70 border border-amber-100 rounded-2xl p-4 min-w-[120px]">
              <span className="text-xs font-semibold text-amber-800 flex items-center gap-1 mb-1">
                <Flame className="w-3.5 h-3.5 text-[var(--color-gold)]" />
                Opanowanie
              </span>
              <span className="text-2xl font-serif font-bold text-[var(--color-gold)]">
                {masteryPercentage}%
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Decks Grid */}
      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5"
      >
        {decks.map(deck => (
          <motion.div key={deck.id} variants={item}>
            <Link 
              href={`/decks/${deck.id}`}
              className="group relative block h-48 sm:h-52 rounded-2xl p-3.5 sm:p-5 flex flex-col justify-end overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            >
              {/* Stack effect background cards (Mochi craftsmanship) */}
              <div className="absolute inset-0 bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100/60 -z-10" />
              <div className="absolute top-0 left-0 w-full h-full bg-white rounded-2xl border border-gray-100/60 -z-20 transform translate-x-2 -translate-y-2 group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform duration-300 ease-[var(--ease-out)]" />
              <div className="absolute top-0 left-0 w-full h-full bg-white rounded-2xl border border-gray-100/60 -z-30 transform translate-x-4 -translate-y-4 group-hover:translate-x-5 group-hover:-translate-y-5 transition-transform duration-300 ease-[var(--ease-out)] opacity-60" />
              
              <motion.div 
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="absolute inset-0 bg-white rounded-2xl z-0 p-3.5 sm:p-5 flex flex-col justify-between shadow-[0_10px_30px_rgba(28,43,69,0.05)] border border-gray-100/80 origin-bottom-left group-hover:border-amber-200/80 transition-colors"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gray-50 flex items-center justify-center text-[var(--color-navy)]/40 group-hover:text-[var(--color-gold)] group-hover:bg-amber-50/50 transition-colors shrink-0">
                    <Layers size={15} />
                  </div>
                  {deck.subject && (
                    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-900/80 truncate max-w-[80px] sm:max-w-[120px]">
                      {deck.subject}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-base sm:text-lg md:text-xl text-[var(--color-navy)] leading-snug group-hover:text-[var(--color-gold)] transition-colors duration-200 line-clamp-3 relative z-10">
                  {deck.title}
                </h3>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

