import { ArrowMarker } from "./DiagramNode";

/*
 * Educational illustration: the same simple loop in three states.
 * Textbook circuit symbols only; no phone values.
 */

const ROW = 150;

const rows = [
  { key: "normal", title: "Normal circuit", lines: ["Current flows around the loop.", "The resistance sets how much."], tone: "data" },
  { key: "open", title: "Open circuit", lines: ["A break stops the current.", "Nothing past it gets power."], tone: "muted" },
  { key: "short", title: "Short circuit", lines: ["A low-resistance path bypasses", "the load: current rises, heat builds."], tone: "red" },
] as const;

/** Battery on the left edge, resistor on the top edge of a rectangular loop. */
function Loop({ y, state }: { y: number; state: (typeof rows)[number]["key"] }) {
  const top = y + 30;
  const bottom = y + 120;
  const wire = state === "open" ? "stroke-muted" : "stroke-ink/70";
  return (
    <g fill="none" strokeWidth={2.5} strokeLinecap="round">
      {/* Left edge with battery */}
      <line x1={40} y1={top} x2={40} y2={y + 66} className={wire} />
      <line x1={40} y1={y + 80} x2={40} y2={bottom} className={wire} />
      <line x1={26} y1={y + 66} x2={54} y2={y + 66} className="stroke-power" strokeWidth={3} />
      <line x1={33} y1={y + 80} x2={47} y2={y + 80} className="stroke-power" strokeWidth={3} />
      <text x={60} y={y + 64} className="fill-power" fontSize={13} stroke="none">+</text>

      {/* Top edge with resistor (the load) */}
      <line x1={40} y1={top} x2={92} y2={top} className={wire} />
      <path
        d={`M92 ${top} l6 -9 l10 18 l10 -18 l10 18 l10 -18 l10 18 l6 -9`}
        className={state === "short" ? "stroke-muted" : "stroke-ink"}
      />
      {state === "open" ? (
        <>
          <line x1={156} y1={top} x2={172} y2={top} className={wire} />
          <line x1={186} y1={top} x2={200} y2={top} className={wire} />
          <text x={179} y={top - 10} textAnchor="middle" className="fill-caution" fontSize={11} stroke="none">break</text>
        </>
      ) : (
        <line x1={156} y1={top} x2={200} y2={top} className={wire} />
      )}
      <text x={124} y={top - 14} textAnchor="middle" className="fill-muted" fontSize={11} stroke="none">load</text>

      {/* Right and bottom edges */}
      <line x1={200} y1={top} x2={200} y2={bottom} className={wire} />
      <line x1={40} y1={bottom} x2={200} y2={bottom} className={wire} />

      {state === "normal" && (
        <line x1={200} y1={y + 55} x2={200} y2={y + 95} className="stroke-data" strokeWidth={3} markerEnd="url(#cs-arrow-data)" />
      )}
      {state === "short" && (
        <>
          {/* Bypass path straight across the loop */}
          <line x1={70} y1={top} x2={70} y2={y + 52} className="stroke-red-400" strokeWidth={3} />
          <line x1={70} y1={y + 52} x2={170} y2={y + 52} className="stroke-red-400" strokeWidth={3} />
          <line x1={170} y1={y + 52} x2={170} y2={top} className="stroke-red-400" strokeWidth={3} />
          <line x1={200} y1={y + 50} x2={200} y2={y + 100} className="stroke-red-400" strokeWidth={5} markerEnd="url(#cs-arrow-red)" />
          <text x={120} y={y + 74} textAnchor="middle" className="fill-red-400" fontSize={11} stroke="none">short</text>
          <path d={`M106 ${y + 92} q4 -8 0 -16 M120 ${y + 92} q4 -8 0 -16 M134 ${y + 92} q4 -8 0 -16`} className="stroke-red-400" strokeWidth={1.5} />
        </>
      )}
    </g>
  );
}

export function CircuitStatesDiagram() {
  return (
    <svg viewBox={`0 0 440 ${rows.length * ROW}`} className="mx-auto w-full max-w-lg" role="img" aria-labelledby="cs-title">
      <title id="cs-title">
        Educational illustration of one circuit in three states. Normal: current flows around the loop through the load.
        Open circuit: a break stops all current. Short circuit: a low-resistance path bypasses the load, so current rises
        sharply and the short heats up.
      </title>
      <defs>
        <ArrowMarker id="cs-arrow-data" className="fill-data" />
        <ArrowMarker id="cs-arrow-red" className="fill-red-400" />
      </defs>
      {rows.map((row, i) => {
        const y = i * ROW;
        return (
          <g key={row.key}>
            {i > 0 && <line x1={10} y1={y} x2={430} y2={y} className="stroke-line" strokeWidth={1} />}
            <Loop y={y} state={row.key} />
            <text x={232} y={y + 58} className={row.tone === "red" ? "fill-red-400 font-semibold" : "fill-ink font-semibold"} fontSize={15}>
              {row.title}
            </text>
            {row.lines.map((line, j) => (
              <text key={line} x={232} y={y + 82 + j * 19} className="fill-muted" fontSize={13}>
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
