"use client";

import { Camera, Brain, Layers, Smartphone, CheckCircle2, RotateCw, Plus, Save, Sparkles } from "lucide-react";
import NotebookScanIllustration from "@/components/NotebookScanIllustration";

export default function StepsSection() {
  return (
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
  );
}
