import type { Metadata } from "next";
import LandingPageClient from "@/components/LandingPageClient";

export const metadata: Metadata = {
  title: "Fiszki AI – zamień zdjęcie notatek w gotowe fiszki do nauki",
  description:
    "Zrób zdjęcie odręcznych notatek lub slajdu, a AI zamieni je w gotowe fiszki. Ucz się skuteczniej do egzaminu, sesji i matury bez żmudnego przepisywania.",
  keywords: [
    "fiszki ai",
    "fiszki ze zdjęcia",
    "jak zamienić notatki w fiszki",
    "skanowanie notatek",
    "odręczne notatki do fiszek",
    "nauka do egzaminu",
    "active recall",
  ],
  openGraph: {
    title: "Fiszki AI – zamień zdjęcie notatek w gotowe fiszki do nauki",
    description:
      "Zrób zdjęcie odręcznych notatek lub slajdu, a AI zamieni je w gotowe fiszki. Ucz się skuteczniej do egzaminu, sesji i matury bez żmudnego przepisywania.",
    type: "website",
    locale: "pl_PL",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Fiszki AI",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "PLN",
      },
      "description":
        "Aplikacja edukacyjna do automatycznego tworzenia fiszek ze zdjęć odręcznych notatek, podręczników i slajdów za pomocą sztucznej inteligencji.",
      "featureList": [
        "Skanowanie i odczyt odręcznych notatek z aparatu",
        "Generowanie pytań i odpowiedzi przez model AI",
        "Interaktywny tryb powtórek z odwracaniem kart 3D",
        "Tryb egzaminu z losowaniem pytań",
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Jak zamienić notatki w fiszki?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Wystarczy skierować aparat telefonu na stronę z zeszytu lub wgrać plik z notatkami. Sztuczna inteligencja analizuje treść i automatycznie formułuje zwięzłe pytania oraz odpowiedzi. Każdą wygenerowaną fiszkę możesz sprawdzić i edytować przed rozpoczęciem powtórek.",
          },
        },
        {
          "@type": "Question",
          "name": "Czy da się robić fiszki ze zdjęcia odręcznych notatek?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Tak, model wizyjny odczytuje pismo odręczne, zakreślenia, definicje oraz schematy z podręczników i zeszytów. Całość działa bezpośrednio w przeglądarce na telefonie i komputerze, bez ręcznego przepisywania tekstu.",
          },
        },
        {
          "@type": "Question",
          "name": "Jak uczyć się do egzaminu ustnego lub obrony z fiszkami?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Fiszki wymuszają aktywny proces przypominania (active recall). W aplikacji odpowiadasz na głos na pytanie przed odwróceniem karty 3D, co idealnie symuluje warunki egzaminu. Wbudowany tryb losowania pozwala przetasować pytania i uodpornić się na stres.",
          },
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingPageClient />
    </>
  );
}
