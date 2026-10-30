import { ArrowMarker } from "./DiagramNode";

export type FlowStep = { title: string; detail: string; side: string | null };

const ROW = 70;
const BOX_X = 16;
const BOX_W = 236;
const BOX_H = 50;

/** Numbered steps down the page, with an optional side note on each. */
export function ProcessFlow({
  id,
  label,
  steps,
  boxClass,
  numberClass,
}: {
  id: string;
  label: string;
  steps: FlowStep[];
  boxClass: string;
  numberClass: string;
}) {
  const height = steps.length * ROW + 10;
  return (
    <svg viewBox={`0 0 440 ${height}`} className="mx-auto w-full max-w-lg" role="img" aria-labelledby={`${id}-title`}>
      <title id={`${id}-title`}>
        {`${label}: ${steps
          .map((s, i) => `${i + 1}, ${s.title}: ${s.detail}${s.side ? ` (${s.side})` : ""}`)
          .join("; ")}.`}
      </title>
      <defs>
        <ArrowMarker id={`${id}-arrow`} className="fill-muted" />
        <ArrowMarker id={`${id}-arrow-side`} className="fill-caution" />
      </defs>
      {steps.map((s, i) => {
        const y = 10 + i * ROW;
        const mid = y + BOX_H / 2;
        return (
          <g key={s.title}>
            {i > 0 && (
              <line x1={BOX_X + BOX_W / 2} y1={y - (ROW - BOX_H) + 2} x2={BOX_X + BOX_W / 2} y2={y - 2} className="stroke-muted" strokeWidth={2} markerEnd={`url(#${id}-arrow)`} />
            )}
            <rect x={BOX_X} y={y} width={BOX_W} height={BOX_H} rx={8} className={`fill-surface ${boxClass}`} strokeWidth={1.5} />
            <text x={BOX_X + 14} y={y + 21} className="fill-ink font-semibold" fontSize={13.5}>
              <tspan className={`${numberClass} font-mono`}>{i + 1}</tspan> {s.title}
            </text>
            <text x={BOX_X + 14} y={y + 39} className="fill-muted" fontSize={11}>
              {s.detail}
            </text>
            {s.side && (
              <>
                <line x1={BOX_X + BOX_W} y1={mid} x2={BOX_X + BOX_W + 22} y2={mid} className="stroke-caution" strokeWidth={1.5} markerEnd={`url(#${id}-arrow-side)`} />
                <text x={BOX_X + BOX_W + 28} y={mid + 4} className="fill-caution" fontSize={11}>
                  {s.side}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
