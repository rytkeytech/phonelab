import { ArrowMarker } from "./DiagramNode";

/*
 * Educational illustration: halving 32,768 Hz fifteen times gives 1 Hz.
 * Arithmetic only (claim C-0001); how a given RTC divides is in its datasheet.
 */

const BOX_W = 104;
const BOX_H = 44;

function Stage({ x, y, label, highlight }: { x: number; y: number; label: string; highlight?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={BOX_W}
        height={BOX_H}
        rx={8}
        className={highlight ? "fill-accent-soft stroke-accent" : "fill-surface stroke-clock"}
        strokeWidth={1.5}
      />
      <text x={x + BOX_W / 2} y={y + 27} textAnchor="middle" className="fill-ink font-mono" fontSize={14}>
        {label}
      </text>
    </g>
  );
}

function Halve({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} className="stroke-clock" strokeWidth={2} markerEnd="url(#rtc-arrow)" />
      <text x={(x1 + x2) / 2} y={y - 9} textAnchor="middle" className="fill-clock font-semibold" fontSize={16}>
        ÷2
      </text>
    </g>
  );
}

export function RtcDividerDiagram() {
  const xs = [16, 168, 320];
  return (
    <svg viewBox="0 0 440 250" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="rtc-title">
      <title id="rtc-title">
        Educational illustration: 32,768 hertz halved to 16,384, then 8,192, then eleven more halvings to 4 hertz, then 2,
        then 1 hertz, which is one tick per second. Fifteen halvings in total, because 32,768 is 2 to the power of 15.
      </title>
      <defs>
        <ArrowMarker id="rtc-arrow" className="fill-clock" />
      </defs>

      <Stage x={xs[0]} y={20} label="32,768 Hz" />
      <Halve x1={xs[0] + BOX_W + 4} x2={xs[1] - 4} y={42} />
      <Stage x={xs[1]} y={20} label="16,384" />
      <Halve x1={xs[1] + BOX_W + 4} x2={xs[2] - 4} y={42} />
      <Stage x={xs[2]} y={20} label="8,192" />

      <path d={`M${xs[2] + BOX_W / 2} 66 L${xs[2] + BOX_W / 2} 100 L${xs[0] + BOX_W / 2} 100 L${xs[0] + BOX_W / 2} 134`} fill="none" className="stroke-clock" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#rtc-arrow)" />
      <text x={220} y={92} textAnchor="middle" className="fill-muted" fontSize={12.5}>
        … 11 more halvings …
      </text>

      <Stage x={xs[0]} y={140} label="4 Hz" />
      <Halve x1={xs[0] + BOX_W + 4} x2={xs[1] - 4} y={162} />
      <Stage x={xs[1]} y={140} label="2 Hz" />
      <Halve x1={xs[1] + BOX_W + 4} x2={xs[2] - 4} y={162} />
      <Stage x={xs[2]} y={140} label="1 Hz" highlight />

      <text x={xs[2] + BOX_W / 2} y={206} textAnchor="middle" className="fill-accent" fontSize={12.5}>
        one tick per second
      </text>
      <text x={220} y={238} textAnchor="middle" className="fill-faint" fontSize={11}>
        15 halvings in total: 32,768 = 2¹⁵
      </text>
    </svg>
  );
}
