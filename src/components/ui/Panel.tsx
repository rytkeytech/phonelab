import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cx } from "@/lib/utils";

/** A titled card used to group dashboard and page content. */
export function Panel({
  title,
  description,
  action,
  className,
  children,
}: {
  title?: string;
  description?: string;
  action?: { href: string; label: string };
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cx(
        "rounded-xl border border-line bg-surface p-4 sm:p-5",
        className,
      )}
    >
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
            {description && (
              <p className="mt-0.5 text-xs text-muted">{description}</p>
            )}
          </div>
          {action && (
            <Link
              href={action.href}
              className="inline-flex shrink-0 items-center gap-1 rounded-md text-xs font-medium text-accent hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
            >
              {action.label}
              <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
