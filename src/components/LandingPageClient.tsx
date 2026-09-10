"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles, Camera, Brain, Layers, Smartphone, CheckCircle2, RotateCw, Plus, Save, HelpCircle } from "lucide-react";
import HeroInteractiveDemo from "@/components/HeroInteractiveDemo";
import NotebookScanIllustration from "@/components/NotebookScanIllustration";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export default function LandingPageClient() {
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
    <main className="flex-1 flex flex-col w-full overflow-x-hidden">
      {/* Sekcja 1: Hero (Kolor A: var(--color-ivory) #FAFAFA) */}
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

      {/* Sekcja 2: Jak działa aplikacja (Kolor B: var(--color-surface-alt) #F0F0F0) */}
      <section className="w-full bg-[var(--color-surface-alt)] py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 px-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-navy)]/60 mb-2 block">
              Jak działa aplikacja
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-navy)] tracking-tight mb-4">
              Trzy kroki do powtórki
            </h2>
            <p className="text-[var(--color-graphite)] text-base sm:text-lg leading-relaxed">
              Zamiast przepisywać podręcznik do edytora tekstu, kierujesz aparat na stronę.
            </p>
          </div>

          {/* Krok 1: Skaner (Aparat i rozpoznawanie) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-24">
            <div className="space-y-5 order-2 lg:order-1">
              <div className="w-10 h-10 rounded-xl bg-white text-[var(--color-navy)] shadow-xs flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--color-navy)] tracking-tight">
                Zdjęcie notatek, książki lub slajdu
              </h3>
              <p className="text-[var(--color-graphite)] text-base leading-relaxed">
                Otwórz zeszyt lub podręcznik. Wbudowany skaner pozwala zrobić zdjęcie aparatem w telefonie lub wgrać plik z dysku. AI odczytuje pismo odręczne, wyróżnienia i szkice.
              </p>
              <ul className="space-y-2.5 pt-2 text-sm font-medium text-[var(--color-navy)]">
                <li className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[var(--color-navy)]/70 shrink-0" />
                  Działa bezpośrednio w przeglądarce telefonu i komputera
                </li>
                <li className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[var(--color-navy)]/70 shrink-0" />
                  Obsługa zdjęć z aparatu, zrzutów ekranu i plików graficznych
                </li>
              </ul>
            </div>

            {/* Płaska ilustracja wektorowa: skanowanie notatek */}
            <NotebookScanIllustration className="order-1 lg:order-2" />
          </div>

          {/* Krok 2: Edytor wygenerowanych fiszek */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-24">
            {/* Real App Mockup: Edit Deck Interface */}
            <div className="relative rounded-3xl overflow-hidden border border-black/8 shadow-[0_16px_40px_rgba(28,43,69,0.08)] bg-white p-6 aspect-[4/3] flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <span className="font-bold text-sm text-[var(--color-navy)]">
                    Nowy zestaw: Biologia komórkowa
                  </span>
                </div>
                <span className="text-xs text-[var(--color-graphite)] bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                  2 fiszki
                </span>
              </div>

              <div className="space-y-3 my-auto overflow-hidden">
                <div className="bg-gray-50/80 rounded-2xl p-3.5 border border-gray-200/60 text-xs space-y-1.5">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[var(--color-graphite)]">Pytanie</span>
                  <p className="font-semibold text-[var(--color-navy)]">Co zachodzi w stadium profazy?</p>
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[var(--color-navy)]/60 block pt-1">Odpowiedź</span>
                  <p className="text-[var(--color-graphite)]">Chromatyna kondensuje się w widoczne chromosomy, zanika otoczka jądrowa.</p>
                </div>

                <div className="bg-gray-50/80 rounded-2xl p-3.5 border border-gray-200/60 text-xs space-y-1.5">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[var(--color-graphite)]">Pytanie</span>
                  <p className="font-semibold text-[var(--color-navy)]">Gdzie układają się chromosomy w metafazie?</p>
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[var(--color-navy)]/60 block pt-1">Odpowiedź</span>
                  <p className="text-[var(--color-graphite)]">W płaszczyźnie równikowej komórki, tworząc płytkę metafazową.</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-semibold">
                <span className="text-[var(--color-graphite)] flex items-center gap-1">
                  <Plus size={14} /> Dodaj fiszkę
                </span>
                <span className="bg-[var(--color-navy)] text-white px-4 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Save size={14} /> Zapisz zestaw
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="w-10 h-10 rounded-xl bg-white text-[var(--color-navy)] shadow-xs flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--color-navy)] tracking-tight">
                Sztuczna inteligencja układa pytania i odpowiedzi
              </h3>
              <p className="text-[var(--color-graphite)] text-base leading-relaxed">
                Model językowy analizuje sens zdań i wyciąga definicje, fakty oraz powiązania logiczne. Każdą wygenerowaną fiszkę możesz przed zapisaniem przejrzeć, zmodyfikować lub uzupełnić o własne notatki.
              </p>
              <ul className="space-y-2.5 pt-2 text-sm font-medium text-[var(--color-navy)]">
                <li className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[var(--color-navy)] shrink-0" />
                  Podział materiału na proste, testowalne jednostki wiedzy
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--color-navy)] shrink-0" />
                  Możliwość edycji treści przed ostatecznym zapisaniem
                </li>
              </ul>
            </div>
          </div>

          {/* Krok 3: Przestrzenny trening */}
          <div className="bg-white rounded-[36px] p-8 sm:p-12 border border-black/5 shadow-[0_16px_40px_rgba(28,43,69,0.06)] text-center max-w-3xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-navy)] text-white flex items-center justify-center mx-auto mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--color-navy)] tracking-tight mb-3">
              Powtórki z odwracaniem kart i trybem egzaminu
            </h3>
            <p className="text-[var(--color-graphite)] text-base leading-relaxed max-w-xl mx-auto mb-8">
              Karty odwracają się z przestrzennym efektem 3D. Możesz uczyć się po kolei lub włączyć losowanie pytań, aby sprawdzić swoją wiedzę tak jak na prawdziwym egzaminie.
            </p>

            <div className="flex flex-wrap justify-center gap-3 text-xs sm:text-sm font-semibold text-[var(--color-navy)]">
              <span className="bg-[var(--color-ivory)] border border-black/5 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--color-navy)]" />
                Sprężyste odwracanie kart 3D
              </span>
              <span className="bg-[var(--color-ivory)] border border-black/5 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-[var(--color-navy)]/70" />
                Tryb przeglądania i egzaminu
              </span>
              <span className="bg-[var(--color-ivory)] border border-black/5 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-navy)]" />
                Stały licznik opanowanych pojęć
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sekcja 3: Przewaga w prozie (Kolor A: var(--color-ivory) #FAFAFA) */}
      <section className="w-full bg-[var(--color-ivory)] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xl sm:text-2xl md:text-3xl font-medium text-[var(--color-navy)] leading-relaxed tracking-tight">
            Ręczne przepisywanie notatek do programów z fiszkami potrafi zająć więcej czasu niż sama nauka.
            Jedno zdjęcie strony z zeszytu pozwala przejść od razu do powtórek.
          </p>
        </div>
      </section>

      {/* Sekcja 4: Często zadawane pytania - FAQ (Kolor B: var(--color-surface-alt) #F0F0F0) */}
      <section className="w-full bg-[var(--color-surface-alt)] py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-navy)]/60 mb-2 block">
              Często zadawane pytania
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-navy)] tracking-tight mb-4">
              Wszystko o fiszkach ze zdjęć
            </h2>
            <p className="text-[var(--color-graphite)] text-base leading-relaxed">
              Krótkie i konkretne odpowiedzi na pytania o skanowanie notatek, działanie AI i przygotowanie do egzaminu.
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-black/5 shadow-[0_4px_20px_rgba(28,43,69,0.03)]">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-navy)] mb-2.5 flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-[var(--color-navy)]/40 shrink-0 mt-1" />
                <span>Jak zamienić notatki w fiszki?</span>
              </h3>
              <p className="text-sm sm:text-base text-[var(--color-graphite)] leading-relaxed pl-7">
                Wystarczy skierować aparat telefonu na stronę z zeszytu lub wgrać plik z notatkami. Sztuczna inteligencja analizuje treść i automatycznie formułuje zwięzłe pytania oraz odpowiedzi. Każdą wygenerowaną fiszkę możesz sprawdzić i edytować przed rozpoczęciem powtórek.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-black/5 shadow-[0_4px_20px_rgba(28,43,69,0.03)]">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-navy)] mb-2.5 flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-[var(--color-navy)]/40 shrink-0 mt-1" />
                <span>Czy da się robić fiszki ze zdjęcia odręcznych notatek?</span>
              </h3>
              <p className="text-sm sm:text-base text-[var(--color-graphite)] leading-relaxed pl-7">
                Tak, model wizyjny odczytuje pismo odręczne, zakreślenia, definicje oraz schematy z podręczników i zeszytów. Całość działa bezpośrednio w przeglądarce na telefonie i komputerze, bez ręcznego przepisywania tekstu.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-black/5 shadow-[0_4px_20px_rgba(28,43,69,0.03)]">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-navy)] mb-2.5 flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-[var(--color-navy)]/40 shrink-0 mt-1" />
                <span>Jak uczyć się do egzaminu ustnego lub obrony z fiszkami?</span>
              </h3>
              <p className="text-sm sm:text-base text-[var(--color-graphite)] leading-relaxed pl-7">
                Fiszki wymuszają aktywny proces przypominania (active recall). W aplikacji odpowiadasz na głos na pytanie przed odwróceniem karty 3D, co idealnie symuluje warunki egzaminu. Wbudowany tryb losowania pozwala przetasować pytania i uodpornić się na stres.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sekcja 5: Finalne CTA (Kolor A: var(--color-ivory) #FAFAFA) */}
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

      {/* Sekcja 6: Footer (Kolor B: var(--color-surface-alt) #F0F0F0) */}
      <Footer />
    </main>
  );
}
