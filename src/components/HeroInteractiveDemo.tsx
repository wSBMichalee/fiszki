"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Scan, RotateCw, Check, X, Layers, Lightbulb } from "lucide-react";

type DemoQuestion = {
  id: string;
  topic: string;
  question: string;
  answer: string;
  keyPoint: string;
};

const DEMO_CARDS: DemoQuestion[] = [
  {
    id: "1",
    topic: "Neurobiologia • Przewodnictwo",
    question: "Czym różni się depolaryzacja od hiperpolaryzacji błony neuronu?",
    answer: "Depolaryzacja to zmniejszenie ujemnego ładunku wnętrza komórki (napływ Na⁺ w stronę +30mV). Hiperpolaryzacja to stan, w którym potencjał staje się bardziej ujemny niż potencjał spoczynkowy (-70mV) w wyniku wypływu jonów K⁺.",
    keyPoint: "Depolaryzacja = pobudzenie; Hiperpolaryzacja = hamowanie"
  },
  {
    id: "2",
    topic: "Neurobiologia • Anatomia",
    question: "Jaka jest funkcja osłonki mielinowej w przewodnictwie aksonalnym?",
    answer: "Osłonka mielinowa działa jak izolator elektryczny, umożliwiając skokowe przewodzenie impulsów między przewężeniami Ranviera. Zwiększa to prędkość przewodzenia impulsu nawet 100-krotnie przy mniejszym zużyciu energii.",
    keyPoint: "Przewodzenie skokowe (saltatory conduction) do 120 m/s"
  },
  {
    id: "3",
    topic: "Neurobiologia • Synapsa",
    question: "Co wyzwala uwolnienie neuroprzekaźników do szczeliny synaptycznej?",
    answer: "Dotarcie potencjału czynnościowego otwiera napięciozależne kanały Ca²⁺ w kolbie presynaptycznej. Napływ wapnia wymusza fuzję pęcherzyków z błoną w drodze egzocytozy.",
    keyPoint: "Kluczowy mediator: napływ jonów wapnia Ca²⁺"
  }
];

export default function HeroInteractiveDemo() {
  const [activeTab, setActiveTab] = useState<"card" | "scan">("card");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [feedback, setFeedback] = useState<"learned" | "review" | null>(null);

  const currentCard = DEMO_CARDS[currentCardIndex];

  const handleNextCard = (type: "learned" | "review") => {
    setFeedback(type);
    setTimeout(() => {
      setFeedback(null);
      setIsFlipped(false);
      setCurrentCardIndex((prev) => (prev + 1) % DEMO_CARDS.length);
    }, 280);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Mode Switch Tabs (Emil Kowalski segmented control) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white/80 rounded-2xl border border-[var(--color-navy)]/10 shadow-[0_4px_20px_rgba(28,43,69,0.04)] backdrop-blur-md mb-6">
        <button
          onClick={() => {
            setActiveTab("card");
            setIsFlipped(false);
          }}
          className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-160 cursor-pointer ${
            activeTab === "card"
              ? "bg-[var(--color-navy)] text-white shadow-sm"
              : "text-[var(--color-graphite)] hover:text-[var(--color-navy)]"
          }`}
          style={{ transitionTimingFunction: "var(--ease-out)" }}
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Interaktywna fiszka 3D
          </span>
        </button>

        <button
          onClick={() => setActiveTab("scan")}
          className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-160 cursor-pointer ${
            activeTab === "scan"
              ? "bg-[var(--color-navy)] text-white shadow-sm"
              : "text-[var(--color-graphite)] hover:text-[var(--color-navy)]"
          }`}
          style={{ transitionTimingFunction: "var(--ease-out)" }}
        >
          <span className="flex items-center gap-1.5">
            <Scan className="w-3.5 h-3.5" />
            Skaner notatek AI
          </span>
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="w-full">
        {activeTab === "card" ? (
          <div className="flex flex-col items-center">
            {/* 3D Card Container */}
            <div className="w-full aspect-[4/3] sm:aspect-[16/11] relative perspective-1000">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCard.id + (feedback || "")}
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    x: feedback === "learned" ? 80 : feedback === "review" ? -80 : 0,
                    rotateZ: feedback === "learned" ? 6 : feedback === "review" ? -6 : 0,
                    rotateY: isFlipped ? 180 : 0
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="w-full h-full cursor-pointer relative"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div className="absolute inset-0 backface-hidden bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-[0_16px_40px_rgba(28,43,69,0.08)] flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-black/5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-navy)]/70">
                        <Sparkles className="w-3 h-3 text-[var(--color-navy)]/60" />
                        {currentCard.topic}
                      </span>
                      <span className="text-xs font-semibold text-[var(--color-graphite)]/60">
                        {currentCardIndex + 1} / {DEMO_CARDS.length}
                      </span>
                    </div>

                    <div className="my-auto py-2">
                      <p className="font-bold text-xl sm:text-2xl text-[var(--color-navy)] leading-snug tracking-tight">
                        {currentCard.question}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-semibold text-[var(--color-graphite)]">
                      <span className="flex items-center gap-1.5 opacity-60">
                        <RotateCw className="w-3.5 h-3.5" />
                        Kliknij, by odwrócić
                      </span>
                      <span className="px-2.5 py-1 bg-gray-50 rounded-full border border-gray-200/60 text-[var(--color-navy)] font-medium">
                        Fiszka AI ze skanu
                      </span>
                    </div>
                  </div>

                  <div
                    className="absolute inset-0 backface-hidden bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-[0_16px_40px_rgba(28,43,69,0.08)] flex flex-col justify-between select-none"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-navy)]/5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-navy)]">
                        <Check className="w-3 h-3 text-[var(--color-navy)]" />
                        Odpowiedź i synteza
                      </span>
                      <span className="text-xs font-semibold text-[var(--color-graphite)]/60">
                        {currentCardIndex + 1} / {DEMO_CARDS.length}
                      </span>
                    </div>

                    <div className="my-auto py-2 space-y-3">
                      <p className="text-sm sm:text-base text-[var(--color-navy)] leading-relaxed">
                        {currentCard.answer}
                      </p>
                      <div className="bg-gray-50 border border-black/5 rounded-xl p-2.5 flex items-start gap-2 text-xs text-[var(--color-navy)]">
                        <Lightbulb className="w-4 h-4 text-[var(--color-navy)]/60 shrink-0 mt-0.5" />
                        <span className="font-medium">{currentCard.keyPoint}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-semibold text-[var(--color-graphite)]">
                      <span className="opacity-60 flex items-center gap-1.5">
                        <RotateCw className="w-3.5 h-3.5" />
                        Kliknij, by wrócić do pytania
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action Buttons under Flip Card */}
            <div className="w-full flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => handleNextCard("review")}
                className="flex-1 py-3 px-4 bg-white border border-gray-200 rounded-2xl text-[var(--color-navy)] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer hover:bg-gray-50"
              >
                <RotateCw size={15} />
                Powtórz
              </button>
              <button
                type="button"
                onClick={() => handleNextCard("learned")}
                className="flex-1 py-3 px-4 bg-[var(--color-navy)] text-white rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer hover:bg-[var(--color-navy)]/90"
              >
                <Check size={16} strokeWidth={2.5} />
                Umiem to!
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full rounded-3xl overflow-hidden border border-gray-200/90 shadow-[0_16px_40px_rgba(28,43,69,0.08)] bg-[var(--color-navy)] text-white p-5 sm:p-6 flex flex-col justify-between aspect-[4/3] sm:aspect-[16/11]">
            <div className="flex items-center justify-between text-xs font-medium z-10">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/90">Wykrywanie notatek</span>
              </div>
            </div>

            <div className="relative my-auto w-full max-w-sm mx-auto aspect-[16/10] rounded-2xl border-2 border-dashed border-white/25 p-4 flex flex-col justify-center overflow-hidden bg-white/5">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-white/60 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-white/60 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-white/60 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-white/60 rounded-br-xl pointer-events-none" />

              <div className="space-y-2 z-10 select-none">
                <div className="p-2 rounded-xl border border-white/20 bg-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/90 truncate">
                    Depolaryzacja błony otwiera kanały Ca²⁺
                  </span>
                  <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider shrink-0 ml-2 bg-black/20 px-1.5 py-0.5 rounded">
                    Pojęcie 1
                  </span>
                </div>

                <div className="p-2 rounded-xl border border-white/20 bg-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/90 truncate">
                    Osłonka mielinowa — przewodnictwo skokowe
                  </span>
                  <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider shrink-0 ml-2 bg-black/20 px-1.5 py-0.5 rounded">
                    Pojęcie 2
                  </span>
                </div>
              </div>

              <motion.div
                initial={{ top: "0%" }}
                animate={{ top: ["5%", "90%", "5%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-0.5 bg-[var(--color-gold)] shadow-[0_0_12px_var(--color-gold)] pointer-events-none"
              />
            </div>

            {/* Viewfinder Controls */}
            <div className="flex items-center justify-between z-10 pt-2 text-xs">
              <span className="text-white/60 text-[11px]">
                Kadruj tekst i naciśnij migawkę
              </span>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80">
                  <Scan size={16} />
                </div>
                <div className="w-11 h-11 rounded-full border-2 border-white flex items-center justify-center cursor-pointer active:scale-95 transition-transform">
                  <div className="w-8 h-8 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
