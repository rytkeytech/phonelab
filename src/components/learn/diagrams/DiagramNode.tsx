import { cx } from "@/lib/utils";

/** A labelled box used by the lesson diagrams. */
export function DiagramNode({
  x,
  y,
  w,
  h,
  title,
  subtitle,
  className = "stroke-line-strong",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  const centerX = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className={cx("fill-surface", className)} strokeWidth={1.5} />
      <text
        x={centerX}
        y={subtitle ? y + h / 2 - 3 : y + h / 2 + 5}
        textAnchor="middle"
        className="fill-ink font-semibold"
        fontSize={14}
      >
        {title}
      </text>
      {subtitle && (
        <text x={centerX} y={y + h / 2 + 14} textAnchor="middle" className="fill-muted" fontSize={11.5}>
          {subtitle}
        </text>
      )}
    </g>
  );
}

/** Arrowhead marker; reference it with markerEnd={`url(#${id})`}. */
export function ArrowMarker({ id, className }: { id: string; className: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" className={className} />
    </marker>
  );
}
