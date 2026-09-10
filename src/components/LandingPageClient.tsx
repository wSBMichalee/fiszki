"use client";

import HeroSection from "@/components/landing/HeroSection";
import StepsSection from "@/components/landing/StepsSection";
import ProseSection from "@/components/landing/ProseSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import Footer from "@/components/Footer";

export default function LandingPageClient() {
  return (
    <main className="flex-1 flex flex-col w-full overflow-x-hidden">
      <HeroSection />
      <StepsSection />
      <ProseSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
