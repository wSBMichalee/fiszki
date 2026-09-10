"use client";

import { motion } from "framer-motion";
import Button from "@/components/Button";

export default function FinalCTASection() {
  return (
    <section className="w-full bg-[var(--color-ivory)] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full bg-[var(--color-navy)] rounded-[36px] p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden"
        >
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at top right, var(--color-gold) 0%, transparent 50%)' }} 
          />
          
          <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Sprawdź ze swoimi notatkami
            </h2>
            <p className="text-white/75 text-base sm:text-lg mb-8 leading-relaxed">
              Zrób zdjęcie jednej strony z zeszytu lub slajdu i zobacz, jak wygląda gotowy zestaw fiszek.
            </p>
            
            <Button
              href="/register"
              variant="gold"
              size="md"
            >
              Załóż darmowe konto
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
