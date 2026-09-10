import { HelpCircle } from "lucide-react";

export default function FAQSection() {
  return (
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
  );
}
