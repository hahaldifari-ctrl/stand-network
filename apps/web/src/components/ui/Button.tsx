import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "gold" | "ghost";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-stand-ink text-white hover:bg-stand-ink-soft shadow-sm hover:shadow-md",
  secondary:
    "border border-stone-300 bg-white text-stand-ink hover:border-stone-400 hover:bg-stone-50",
  gold:
    "bg-stand-gold text-white hover:bg-[#9d7425] shadow-sm hover:shadow-md",
  ghost:
    "bg-transparent text-stand-ink hover:bg-stand-cream-deep",
};

const baseClasses =
  "stand-interactive inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold disabled:pointer-events-none disabled:opacity-50";

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}