"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { signup } from "@/app/login/actions";
import Button from "@/components/Button";

interface RegisterFormProps {
  initialError?: string;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({
  initialError,
  onSwitchToLogin,
}: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayError = validationError || initialError;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setValidationError(null);

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

    setIsSubmitting(true);
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
            placeholder="Minimum 6 znaków"
            className="px-4 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]/15 focus:border-[var(--color-navy)] transition-all duration-160 text-sm bg-white text-[var(--color-navy)] placeholder:text-[var(--color-graphite)]/40"
          />
        </div>

        {/* Confirm Password field */}
        <div className="flex flex-col gap-1.5">
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
            formAction={signup}
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
                <span>Utwórz konto</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </motion.form>

      {/* Footer switch hint */}
      <div className="text-center text-xs text-[var(--color-graphite)] pt-2 border-t border-black/5">
        Masz już swoje konto?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[var(--color-navy)] font-bold hover:underline cursor-pointer ml-1"
        >
          Zaloguj się
        </button>
      </div>
    </div>
  );
}
