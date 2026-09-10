"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { login, signup } from "@/app/login/actions";
import Button from "@/components/Button";

interface AuthCardProps {
  initialMode?: "login" | "register";
  initialError?: string;
}

export default function AuthCard({
  initialMode = "login",
  initialError,
}: AuthCardProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const displayError = validationError || initialError;

  const handleTabChange = (newMode: "login" | "register") => {
    setMode(newMode);
    setValidationError(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", newMode === "login" ? "/login" : "/register");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setValidationError(null);

    if (mode === "register") {
      if (password.length < 6) {
        e.preventDefault();
        setValidationError("Hasło musi mieć co najmniej 6 znaków.");
        return;
      }
      if (password !== confirmPassword) {
        e.preventDefault();
        setValidationError("Hasła nie są identyczne. Wpisz dokładnie to samo hasło w obu polach.");
        return;
      }
    }

    setIsSubmitting(true);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setValidationError(null);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        setValidationError(
          error.message || "Logowanie przez Google jest w tej chwili niedostępne. Sprawdź konfigurację providera w Supabase."
        );
        setIsGoogleLoading(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd podczas łączenia z Google.";
      setValidationError(message);
      setIsGoogleLoading(false);
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
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full gap-2.5 font-semibold text-xs sm:text-sm"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isSubmitting}
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[var(--color-navy)]" />
                <span>Łączenie z Google...</span>
              </>
            ) : (
              <>
                {/* Official Google G 4-Color SVG Icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"
                  />
                </svg>
                <span>Kontynuuj z Google</span>
              </>
            )}
          </Button>

          {/* Elegant "lub" separator */}
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
          <motion.form
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="email" 
                className="text-xs font-semibold text-[var(--color-navy)] uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj.email@domena.pl"
                className="px-4 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]/15 focus:border-[var(--color-navy)] transition-all duration-160 text-sm bg-white text-[var(--color-navy)] placeholder:text-[var(--color-graphite)]/40"
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="password" 
                className="text-xs font-semibold text-[var(--color-navy)] uppercase tracking-wider"
              >
                Hasło
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "Minimum 6 znaków" : "••••••••"}
                className="px-4 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]/15 focus:border-[var(--color-navy)] transition-all duration-160 text-sm bg-white text-[var(--color-navy)] placeholder:text-[var(--color-graphite)]/40"
              />
            </div>

            {/* Confirm Password field (visible only in register mode) */}
            {mode === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.16 }}
                className="flex flex-col gap-1.5 overflow-hidden"
              >
                <label 
                  htmlFor="confirmPassword" 
                  className="text-xs font-semibold text-[var(--color-navy)] uppercase tracking-wider"
                >
                  Powtórz hasło
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Wpisz ponownie to samo hasło"
                  className={`px-4 py-2.5 rounded-xl border transition-all duration-160 text-sm bg-white text-[var(--color-navy)] placeholder:text-[var(--color-graphite)]/40 focus:outline-none focus:ring-2 ${
                    confirmPassword && confirmPassword !== password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-black/10 focus:border-[var(--color-navy)] focus:ring-[var(--color-navy)]/15"
                  }`}
                />
              </motion.div>
            )}

            {/* Error Message Display */}
            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50/90 text-[var(--color-brick)] text-xs rounded-xl border border-red-200/60 flex items-start gap-2 leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-brick)]" />
                <span>{displayError}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                formAction={mode === "login" ? login : signup}
                type="submit"
                variant="primary"
                size="md"
                className="w-full gap-2 group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Przetwarzanie...</span>
                  </>
                ) : mode === "login" ? (
                  <>
                    <span>Zaloguj się</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                ) : (
                  <>
                    <span>Utwórz konto</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        </AnimatePresence>

        {/* Footer switch hint */}
        <div className="text-center text-xs text-[var(--color-graphite)] pt-2 border-t border-black/5">
          {mode === "login" ? (
            <>
              Nie masz jeszcze konta?{" "}
              <button
                type="button"
                onClick={() => handleTabChange("register")}
                className="text-[var(--color-navy)] font-bold hover:underline cursor-pointer ml-1"
              >
                Zarejestruj się
              </button>
            </>
          ) : (
            <>
              Masz już swoje konto?{" "}
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className="text-[var(--color-navy)] font-bold hover:underline cursor-pointer ml-1"
              >
                Zaloguj się
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
