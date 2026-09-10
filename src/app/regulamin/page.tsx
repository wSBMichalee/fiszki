import Link from "next/link";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex-1 flex flex-col justify-between">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-16">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-graphite)] hover:text-[var(--color-navy)] transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Wróć do strony głównej
        </Link>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-navy)] tracking-tight mb-4">
          Regulamin
        </h1>
        <p className="text-[var(--color-graphite)] text-base leading-relaxed mb-4">
          Treść regulaminu korzystania z serwisu Fiszki zostanie opublikowana wkrótce.
        </p>
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs text-sm text-[var(--color-graphite)]">
          Dokument w przygotowaniu. Korzystanie z aplikacji w fazie testowej jest bezpłatne.
        </div>
      </main>
      <Footer />
    </div>
  );
}
