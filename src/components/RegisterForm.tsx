"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowRight, Loader2, Eye, EyeOff, Check, Circle } from "lucide-react";
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
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const displayError = validationError || initialError;

  // Password requirements
  const hasMinLength = password.length >= 8;
  const hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const allRequirementsMet = hasMinLength && hasUpperAndLower && hasDigit;
  
  const strengthScore = [hasMinLength, hasUpperAndLower, hasDigit].filter(Boolean).length;
  
  const isFormValid = email.length > 0 && allRequirementsMet && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setValidationError(null);

    if (!allRequirementsMet) {
      e.preventDefault();
      setValidationError("Hasło nie spełnia wszystkich wymagań bezpieczeństwa.");
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
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 znaków"
              className="px-4 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]/15 focus:border-[var(--color-navy)] transition-all duration-160 text-sm bg-white text-[var(--color-navy)] placeholder:text-[var(--color-graphite)]/40 w-full pr-11"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-graphite)] hover:text-[var(--color-navy)] transition-colors p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          <AnimatePresence>
            {password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                {/* Strength bar */}
                <div className="flex gap-1.5 mb-2">
                  {[1, 2, 3].map((index) => {
                    let bgColor = "bg-black/10";
                    if (strengthScore > 0 && index <= strengthScore) {
                      if (strengthScore === 1) bgColor = "bg-[#B5544F]"; // brick
                      else if (strengthScore === 2) bgColor = "bg-[#D9A441]"; // amber
                      else bgColor = "bg-[#4B7A5E]"; // green
                    }
                    return (
                      <div 
                        key={index} 
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${bgColor}`} 
                      />
                    );
                  })}
                </div>
                
                {/* Checklist */}
                <ul className="flex flex-col gap-1.5 text-xs">
                  <li className={`flex items-center gap-1.5 transition-colors duration-300 ${hasMinLength ? 'text-[#4B7A5E]' : 'text-[var(--color-graphite)]/60'}`}>
                    {hasMinLength ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />}
                    <span>min. 8 znaków</span>
                  </li>
                  <li className={`flex items-center gap-1.5 transition-colors duration-300 ${hasUpperAndLower ? 'text-[#4B7A5E]' : 'text-[var(--color-graphite)]/60'}`}>
                    {hasUpperAndLower ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />}
                    <span>wielka i mała litera</span>
                  </li>
                  <li className={`flex items-center gap-1.5 transition-colors duration-300 ${hasDigit ? 'text-[#4B7A5E]' : 'text-[var(--color-graphite)]/60'}`}>
                    {hasDigit ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />}
                    <span>przynajmniej jedna cyfra</span>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Confirm Password field */}
        <div className="flex flex-col gap-1.5">
          <label 
            htmlFor="confirmPassword" 
            className="text-xs font-semibold text-[var(--color-navy)] uppercase tracking-wider"
          >
            Powtórz hasło
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Wpisz ponownie to samo hasło"
              className={`px-4 py-2.5 rounded-xl border transition-all duration-160 text-sm bg-white text-[var(--color-navy)] placeholder:text-[var(--color-graphite)]/40 focus:outline-none focus:ring-2 w-full pr-11 ${
                confirmPassword && confirmPassword !== password
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-black/10 focus:border-[var(--color-navy)] focus:ring-[var(--color-navy)]/15"
              }`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-graphite)] hover:text-[var(--color-navy)] transition-colors p-1"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          <AnimatePresence>
            {confirmPassword.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${password === confirmPassword ? 'text-[#4B7A5E]' : 'text-[#B5544F]'}`}>
                  {password === confirmPassword ? (
                    <Check className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>
                    {password === confirmPassword 
                      ? "Hasła są zgodne" 
                      : "Hasła różnią się od siebie"
                    }
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error Message Display */}
        <AnimatePresence>
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              className="p-3 mt-1 bg-red-50/90 text-[var(--color-brick)] text-xs rounded-xl border border-red-200/60 flex items-start gap-2 leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-brick)]" />
              <span>{displayError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            formAction={signup}
            type="submit"
            variant="primary"
            size="md"
            className="w-full gap-2 group"
            disabled={isSubmitting || !isFormValid}
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

