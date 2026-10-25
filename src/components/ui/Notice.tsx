import { FlaskConical, TriangleAlert } from "lucide-react";
import { cx } from "@/lib/utils";

const variants = {
  sample: {
    icon: FlaskConical,
    className: "border-caution/25 bg-caution-soft text-caution",
  },
  conceptual: {
    icon: TriangleAlert,
    className: "border-caution/25 bg-caution-soft text-caution",
  },
};

/** Honest-labelling banner for sample data and conceptual content. */
export function Notice({
  variant,
  title,
  children,
  className,
}: {
  variant: keyof typeof variants;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, className: tone } = variants[variant];
  return (
    <div
      role="note"
      className={cx("flex gap-3 rounded-lg border px-3.5 py-3 text-sm", tone, className)}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div>
        <p className="font-semibold">{title}</p>
        {children && <div className="mt-0.5 text-ink/75">{children}</div>}
      </div>
    </div>
  );
}
