import type { ReactNode } from "react";

type BadgeTone = "neutral" | "gold" | "green" | "red" | "blue";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const tones: Record<BadgeTone, string> = {
  neutral: "bg-stone-100 text-stone-700 border-stone-200",
  gold: "bg-stand-gold-pale text-[#795b1e] border-[#e4cf9f]",
  green: "bg-stand-green-light text-stand-green border-[#bdd8ca]",
  red: "bg-stand-red-light text-stand-red border-[#e6c0be]",
  blue: "bg-stand-blue-light text-stand-blue border-[#c5d7e0]",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}