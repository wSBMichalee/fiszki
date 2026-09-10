"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import HeroInteractiveDemo from "@/components/HeroInteractiveDemo";
import Button from "@/components/Button";

export default function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 16 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 320, damping: 24 },
    },
  };

  return (
    <section className="w-full bg-[var(--color-ivory)] pt-12 pb-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-start justify-start text-left"
      >
        {/* Pigułka nad nagłówkiem */}
        <motion.div 
          variants={itemVariants} 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[var(--color-navy)]/10 text-xs sm:text-sm font-semibold text-[var(--color-navy)] shadow-xs backdrop-blur-md mb-6"
        >
          <Sparkles className="w-4 h-4 text-[var(--color-navy)]/70" />
          <span>Skaner odręcznych notatek i fiszki AI</span>
        </motion.div>

        {/* H1 - zmniejszony rozmiar: text-3xl sm:text-5xl md:text-6xl lg:text-7xl, system font, wyrównany do lewej */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--color-navy)] max-w-4xl"
          style={{ letterSpacing: "-0.035em", lineHeight: "1.08" }}
        >
          Od zdjęcia w zeszycie do gotowych fiszek.
        </motion.h1>

        {/* Opis */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-xl text-[var(--color-graphite)] max-w-2xl leading-relaxed mt-6 mb-8 text-left"
        >
          Zrób zdjęcie strony z zeszytu, książki lub slajdu. Sztuczna inteligencja odczyta pismo odręczne i ułoży zwięzłe pytania z odpowiedziami do nauki.
        </motion.p>

        {/* Hero CTAs - Wyrównane do lewej */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-6">
          <Button
            href="/register"
            variant="primary"
            size="md"
            className="gap-2 group"
          >
            Zacznij naukę
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            href="/login"
            variant="secondary"
            size="md"
          >
            Zaloguj się
          </Button>
        </motion.div>

        {/* Value badges - Wyrównane do lewej, czyste ikony */}
        <motion.div 
          variants={itemVariants} 
          className="flex flex-wrap items-center justify-start gap-4 text-xs font-semibold text-[var(--color-graphite)] mb-12 opacity-85"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[var(--color-navy)]" />
            Zero ręcznego przepisywania
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[var(--color-navy)]" />
            Odczyt pisma odręcznego i rysunków
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[var(--color-navy)]" />
            Darmowy tryb nauki w telefonie i na komputerze
          </span>
        </motion.div>

        {/* Interactive 3D Product Demo in Hero */}
        <motion.div variants={itemVariants} className="w-full pt-4">
          <HeroInteractiveDemo />
        </motion.div>
      </motion.div>
    </section>
  );
}
