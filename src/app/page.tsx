"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0, duration: 0.6 },
    },
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-2xl w-full flex flex-col items-center gap-8"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-[var(--color-navy)]/10 text-sm font-medium text-[var(--color-navy)] shadow-sm backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
          <span>Inteligentne fiszki ze zdjęć</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--color-navy)]"
          style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.03em", lineHeight: "1.05" }}
        >
          Ucz się mądrzej,<br />nie dłużej.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-[var(--color-graphite)] max-w-lg leading-relaxed"
        >
          Zrób zdjęcie swoich notatek, a nasz system natychmiast wygeneruje gotowy zestaw inteligentnych fiszek do nauki.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link
            href="/register"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-navy)] text-white rounded-2xl font-medium text-lg transition-transform duration-200 ease-[var(--ease-out)] active:scale-[0.97]"
          >
            Zacznij naukę
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 ease-[var(--ease-out)]" />
          </Link>
          
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-4 bg-white/50 text-[var(--color-navy)] border border-[var(--color-navy)]/10 rounded-2xl font-medium text-lg transition-transform duration-200 ease-[var(--ease-out)] active:scale-[0.97] backdrop-blur-sm"
          >
            Zaloguj się
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
