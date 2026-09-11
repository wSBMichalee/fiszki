"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/Button";

interface LoginFormProps {
  initialError?: string;
  onSwitchToRegister: () => void;
}

export default function LoginForm({
  initialError,
  onSwitchToRegister,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const displayError = validationError || initialError;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient({
        rememberMe,
        storage: !rememberMe && typeof window !== "undefined" ? window.sessionStorage : undefined,
      });

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setValidationError(
          error.message === "Invalid login credentials"
            ? "Nie udało się zalogować. Sprawdź dane."
            : error.message || "Nie udało się zalogować. Sprawdź dane."
        );
        setIsSubmitting(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Wystąpił nieoczekiwany błąd podczas logowania.";
      setValidationError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.form
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
            placeholder="••••••••"
            className="px-4 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]/15 focus:border-[var(--color-navy)] transition-all duration-160 text-sm bg-white text-[var(--color-navy)] placeholder:text-[var(--color-graphite)]/40"
          />
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2 pt-0.5 select-none">
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-black/20 text-[var(--color-navy)] focus:ring-[var(--color-navy)]/20 cursor-pointer accent-[var(--color-navy)]"
          />
          <label
            htmlFor="remember-me"
            className="text-xs font-medium text-[var(--color-navy)] cursor-pointer"
          >
            Zapamiętaj mnie
          </label>
        </div>

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
            ) : (
              <>
                <span>Zaloguj się</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </motion.form>

      {/* Footer switch hint */}
      <div className="text-center text-xs text-[var(--color-graphite)] pt-2 border-t border-black/5">
        Nie masz jeszcze konta?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-[var(--color-navy)] font-bold hover:underline cursor-pointer ml-1"
        >
          Zarejestruj się
        </button>
      </div>
    </div>
  );
}
