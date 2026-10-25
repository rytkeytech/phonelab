import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-accent"
    >
      <svg viewBox="0 0 32 32" aria-hidden className="size-8">
        <rect x="1" y="1" width="30" height="30" rx="8" className="fill-accent-soft stroke-accent/40" />
        {/* Chip with pins */}
        <rect x="10" y="10" width="12" height="12" rx="2" className="fill-none stroke-accent" strokeWidth="1.75" />
        <rect x="13.5" y="13.5" width="5" height="5" rx="1" className="fill-accent" />
        {[13, 16, 19].map((p) => (
          <g key={p} className="stroke-accent/70" strokeWidth="1.5" strokeLinecap="round">
            <line x1={p} y1="6" x2={p} y2="8.5" />
            <line x1={p} y1="23.5" x2={p} y2="26" />
            <line x1="6" y1={p} x2="8.5" y2={p} />
            <line x1="23.5" y1={p} x2="26" y2={p} />
          </g>
        ))}
      </svg>
      <span className="text-base font-semibold tracking-tight text-ink">
        Phone<span className="text-accent">Lab</span>
      </span>
    </Link>
  );
}
