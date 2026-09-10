import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Fiszki AI – zamień zdjęcie notatek w gotowe fiszki do nauki",
  description: "Zrób zdjęcie odręcznych notatek lub slajdu, a AI zamieni je w gotowe fiszki. Ucz się skuteczniej do egzaminu, sesji i matury bez żmudnego przepisywania.",
  keywords: [
    "fiszki ai",
    "fiszki ze zdjęcia",
    "jak zamienić notatki w fiszki",
    "skanowanie notatek",
    "odręczne notatki do fiszek",
    "nauka do egzaminu",
    "active recall"
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
