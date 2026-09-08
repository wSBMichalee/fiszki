"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";

type Deck = {
  id: string;
  title: string;
  created_at: string;
};

export default function DashboardGrid({ decks }: { decks: Deck[] }) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.4
      }
    },
  };

  if (!decks || decks.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <p className="text-[var(--color-graphite)] mb-6 text-lg">Nie masz jeszcze żadnych zestawów fiszek.</p>
        <Link 
          href="/decks/new" 
          className="inline-flex items-center gap-2 bg-[var(--color-navy)] text-white px-6 py-3 rounded-xl font-medium transition-transform duration-[160ms] ease-[var(--ease-out)] cursor-pointer active:scale-[0.97]"
        >
          Utwórz swój pierwszy zestaw
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2"
    >
      {decks.map(deck => (
        <motion.div key={deck.id} variants={item}>
          <Link 
            href={`/decks/${deck.id}`}
            className="group relative block h-48 rounded-2xl p-5 flex flex-col justify-end overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
          >
            {/* The base stack cards */}
            <div className="absolute inset-0 bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100/50 -z-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-white rounded-2xl border border-gray-100/50 -z-20 transform translate-x-1.5 -translate-y-1.5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-[400ms] ease-[var(--ease-out)]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-white rounded-2xl border border-gray-100/50 -z-30 transform translate-x-3 -translate-y-3 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-[400ms] ease-[var(--ease-out)] opacity-50"></div>
            
            <motion.div 
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              className="absolute inset-0 bg-white rounded-2xl z-0 p-5 flex flex-col justify-end shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 origin-bottom-left"
            >
              <h3 className="font-serif font-bold text-xl text-[var(--color-navy)] leading-tight group-hover:text-[var(--color-gold)] transition-colors duration-200 line-clamp-4 relative z-10">
                {deck.title}
              </h3>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
