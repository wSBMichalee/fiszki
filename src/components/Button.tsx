import Link from "next/link";
import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "gold" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-navy)] text-white shadow-[0_4px_0_#0f1726] hover:bg-[#25395c] active:shadow-none active:translate-y-1",
  secondary:
    "bg-white/80 text-[var(--color-navy)] border border-[var(--color-navy)]/15 shadow-[0_4px_0_rgba(28,43,69,0.08)] hover:bg-white active:shadow-none active:translate-y-1 backdrop-blur-xs",
  ghost:
    "bg-transparent text-[var(--color-navy)] border border-[var(--color-navy)]/15 hover:bg-white/70 active:bg-black/5",
  gold:
    "bg-[var(--color-gold)] text-[var(--color-navy)] shadow-[0_4px_0_#b58428] hover:bg-[#ebbb60] active:shadow-none active:translate-y-1",
  danger:
    "bg-transparent text-[var(--color-brick)] border border-[var(--color-brick)]/20 hover:bg-red-50 active:bg-red-100",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs font-semibold rounded-xl",
  md: "h-11 px-6 text-sm font-semibold rounded-xl",
  lg: "h-12 px-7 text-sm font-bold rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center select-none cursor-pointer transition-all duration-160 ease-[var(--ease-out)] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] disabled:opacity-50 disabled:pointer-events-none";

  const classes = `${baseClasses} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
