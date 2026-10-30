/*
 * Textbook circuit symbols shared by the lesson diagrams. Each one starts at
 * the point given and has a fixed size, so wires can be drawn up to its ends.
 */

const WIRE = "stroke-ink/70";

/** Resistor running left to right, 48 long, from (x, y). */
export function ResistorH({ x, y, className = "stroke-ink" }: { x: number; y: number; className?: string }) {
  return <path d={`M${x} ${y} l6 -8 l9 16 l9 -16 l9 16 l9 -16 l6 8`} fill="none" className={className} strokeWidth={2} strokeLinejoin="round" />;
}

/** Resistor running top to bottom, 48 long, from (x, y). */
export function ResistorV({ x, y, className = "stroke-ink" }: { x: number; y: number; className?: string }) {
  return <path d={`M${x} ${y} l-8 6 l16 9 l-16 9 l16 9 l-16 9 l8 6`} fill="none" className={className} strokeWidth={2} strokeLinejoin="round" />;
}

/** Capacitor running top to bottom, 30 long, from (x, y). */
export function CapacitorV({ x, y, className = WIRE }: { x: number; y: number; className?: string }) {
  return (
    <g className={className} strokeWidth={2}>
      <line x1={x} y1={y} x2={x} y2={y + 11} />
      <line x1={x - 11} y1={y + 11} x2={x + 11} y2={y + 11} />
      <line x1={x - 11} y1={y + 19} x2={x + 11} y2={y + 19} />
      <line x1={x} y1={y + 19} x2={x} y2={y + 30} />
    </g>
  );
}

/** Capacitor running left to right, 30 long, from (x, y). */
export function CapacitorH({ x, y, className = WIRE }: { x: number; y: number; className?: string }) {
  return (
    <g className={className} strokeWidth={2}>
      <line x1={x} y1={y} x2={x + 11} y2={y} />
      <line x1={x + 11} y1={y - 11} x2={x + 11} y2={y + 11} />
      <line x1={x + 19} y1={y - 11} x2={x + 19} y2={y + 11} />
      <line x1={x + 19} y1={y} x2={x + 30} y2={y} />
    </g>
  );
}

/** Ground symbol hanging below (x, y). */
export function Ground({ x, y }: { x: number; y: number }) {
  return (
    <g className="stroke-muted" strokeWidth={2}>
      <line x1={x - 10} y1={y} x2={x + 10} y2={y} />
      <line x1={x - 6} y1={y + 5} x2={x + 6} y2={y + 5} />
      <line x1={x - 2} y1={y + 10} x2={x + 2} y2={y + 10} />
    </g>
  );
}

/** A named supply: a short bar at (x, y) with its label above. */
export function Supply({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <line x1={x - 11} y1={y} x2={x + 11} y2={y} className="stroke-power" strokeWidth={2.5} />
      <text x={x} y={y - 7} textAnchor="middle" className="fill-power" fontSize={11.5}>
        {label}
      </text>
    </g>
  );
}

/** Straight wire through the given points. */
export function Wire({ points, className = WIRE, width = 2 }: { points: [number, number][]; className?: string; width?: number }) {
  return <polyline points={points.map((p) => p.join(",")).join(" ")} fill="none" className={className} strokeWidth={width} strokeLinejoin="round" />;
}

/** Junction dot where wires connect. */
export function Node({ x, y, className = "fill-ink" }: { x: number; y: number; className?: string }) {
  return <circle cx={x} cy={y} r={3.5} className={className} />;
}

/** Key running top to bottom, 30 long, from (x, y). Closed shows it pressed. */
export function KeyV({ x, y, closed = false, className = "stroke-ink" }: { x: number; y: number; closed?: boolean; className?: string }) {
  return (
    <g className={className} strokeWidth={2}>
      <circle cx={x} cy={y + 5} r={2.5} fill="none" />
      <circle cx={x} cy={y + 25} r={2.5} fill="none" />
      <line x1={x} y1={y + 7} x2={closed ? x : x + 13} y2={closed ? y + 23 : y + 21} />
    </g>
  );
}

/** Quartz crystal running top to bottom, 40 long, from (x, y). */
export function CrystalV({ x, y }: { x: number; y: number }) {
  return (
    <g className="stroke-ink" strokeWidth={2}>
      <line x1={x} y1={y} x2={x} y2={y + 8} />
      <line x1={x - 13} y1={y + 8} x2={x + 13} y2={y + 8} />
      <rect x={x - 10} y={y + 13} width={20} height={14} className="fill-raised" strokeWidth={1.5} />
      <line x1={x - 13} y1={y + 32} x2={x + 13} y2={y + 32} />
      <line x1={x} y1={y + 32} x2={x} y2={y + 40} />
    </g>
  );
}
