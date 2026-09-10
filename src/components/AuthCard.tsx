"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

interface AuthCardProps {
  initialMode?: "login" | "register";
  initialError?: string;
}

export default function AuthCard({
  initialMode = "login",
  initialError,
}: AuthCardProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError || null);

  const handleTabChange = (newMode: "login" | "register") => {
    setMode(newMode);
    setErrorMessage(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", newMode === "login" ? "/login" : "/register");
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 bg-[var(--color-ivory)]">
      {/* Visual motif: 3 overlapping miniature flashcards */}
      <div className="relative w-24 h-16 mb-4 flex items-center justify-center select-none pointer-events-none">
        {/* Back card 1 (tilted left) */}
        <div 
          className="absolute w-14 h-11 rounded-xl bg-white border border-black/8 shadow-xs transform -rotate-8 -translate-x-3 translate-y-1 opacity-80"
        />
        {/* Back card 2 (tilted right) */}
        <div 
          className="absolute w-14 h-11 rounded-xl bg-white border border-black/8 shadow-xs transform rotate-6 translate-x-3 translate-y-0.5 opacity-80"
        />
        {/* Front main card (center) */}
        <div 
          className="relative z-10 w-16 h-12 rounded-xl bg-white border border-black/10 shadow-[0_8px_20px_rgba(28,43,69,0.08)] flex flex-col justify-between p-2"
        >
          <div className="flex items-center justify-between">
            <div className="w-4 h-1 rounded-full bg-[var(--color-navy)]/30" />
            <Sparkles className="w-2.5 h-2.5 text-[var(--color-gold)]" />
          </div>
          <div className="space-y-1">
            <div className="w-9 h-1 rounded-full bg-[var(--color-navy)]/20" />
            <div className="w-6 h-1 rounded-full bg-[var(--color-navy)]/15" />
          </div>
        </div>
      </div>

      {/* Main Auth Card Container */}
      <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-3xl shadow-[0_16px_40px_rgba(28,43,69,0.06)] border border-black/5 flex flex-col gap-6">
        {/* Title and subtitle */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-navy)] tracking-tight">
            Fiszki
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-graphite)] mt-1.5">
            {mode === "login" 
              ? "Zaloguj się, aby przejść do swoich zestawów" 
              : "Utwórz darmowe konto i zacznij powtórki ze zdjęć"}
          </p>
        </div>

        {/* Tab Switcher (Segmented Control with Framer Motion) */}
        <div className="relative flex p-1 rounded-2xl bg-black/[0.04] border border-black/5 select-none">
          <button
            type="button"
            onClick={() => handleTabChange("login")}
            className={`relative flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors duration-150 z-10 cursor-pointer ${
              mode === "login"
                ? "text-[var(--color-navy)]"
                : "text-[var(--color-graphite)] hover:text-[var(--color-navy)]"
            }`}
          >
            {mode === "login" && (
              <motion.div
                layoutId="authTabIndicator"
                className="absolute inset-0 bg-white rounded-xl shadow-xs"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">Zaloguj się</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("register")}
            className={`relative flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors duration-150 z-10 cursor-pointer ${
              mode === "register"
                ? "text-[var(--color-navy)]"
                : "text-[var(--color-graphite)] hover:text-[var(--color-navy)]"
            }`}
          >
            {mode === "register" && (
              <motion.div
                layoutId="authTabIndicator"
                className="absolute inset-0 bg-white rounded-xl shadow-xs"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">Zarejestruj się</span>
          </button>
        </div>

        {/* Google OAuth Button */}
        <div className="flex flex-col gap-4">
          <GoogleAuthButton onError={setErrorMessage} />

          {/* "lub" separator */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/8" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[var(--color-graphite)]/50">
              lub
            </span>
          </div>
        </div>

        {/* Dynamic Form with Animated Transition */}
        <AnimatePresence mode="wait" initial={false}>
          {mode === "login" ? (
            <LoginForm
              key="login"
              initialError={errorMessage || undefined}
              onSwitchToRegister={() => handleTabChange("register")}
            />
          ) : (
            <RegisterForm
              key="register"
              initialError={errorMessage || undefined}
              onSwitchToLogin={() => handleTabChange("login")}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
