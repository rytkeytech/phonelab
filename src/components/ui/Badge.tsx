import { cx } from "@/lib/utils";

type Tone = "neutral" | "accent" | "caution";

const tones: Record<Tone, string> = {
  neutral: "border-line-strong bg-raised text-muted",
  accent: "border-accent/30 bg-accent-soft text-accent",
  caution: "border-caution/30 bg-caution-soft text-caution",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
