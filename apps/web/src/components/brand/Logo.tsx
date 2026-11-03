import Link from "next/link";

interface LogoProps {
  href?: string;
  light?: boolean;
}

export function Logo({ href = "/", light = false }: LogoProps) {
  const content = (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black tracking-tight ${
          light
            ? "bg-white text-stand-ink"
            : "bg-stand-ink text-white"
        }`}
      >
        SN
      </span>

      <span
        className={`text-xl font-black tracking-[-0.04em] ${
          light ? "text-white" : "text-stand-ink"
        }`}
      >
        STAND<span className="text-stand-gold">.</span>
      </span>
    </span>
  );

  return (
    <Link href={href} aria-label="STAND Network home">
      {content}
    </Link>
  );
}