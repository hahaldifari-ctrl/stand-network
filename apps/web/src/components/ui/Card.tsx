import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Card({
  children,
  className = "",
  interactive = false,
}: CardProps) {
  return (
    <div
      className={`rounded-[24px] border border-stone-200/80 bg-white shadow-stand-card ${
        interactive ? "stand-hover-lift" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}