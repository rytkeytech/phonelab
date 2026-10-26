/*
 * Educational illustration: the general shapes of bench-supply current over
 * time that the lesson describes. Shapes only: no values, because normal
 * current differs between models.
 */

const ROW = 92;
const GX = 20; // graph left
const GW = 180; // graph width
const PRESS = GX + 50; // where the power key is pressed

const patterns = [
  { title: "Current before pressing power", lines: ["Short on the main supply line", "or something connected to it"], shape: "early" },
  { title: "No current at all", lines: ["Power-on trigger not reaching", "the PMIC, or PMIC not starting"], shape: "none" },
  { title: "Small jump, back to zero", lines: ["Power-on sequence starts, stops:", "missing rail, clock, reset…"], shape: "blip" },
  { title: "Rises, then stays fixed", lines: ["Boot may be stuck early,", "e.g. not loading from storage"], shape: "stuck" },
  { title: "Rises, varies, drops, repeats", lines: ["Boot loop: firmware, storage,", "RAM or power can all cause it"], shape: "loop" },
] as const;

function trace(shape: (typeof patterns)[number]["shape"], base: number, top: number) {
  const mid = (base + top) / 2;
  const end = GX + GW;
  switch (shape) {
    case "early":
      return `M${GX} ${base} L${GX + 14} ${base} L${GX + 18} ${top} L${end} ${top}`;
    case "none":
      return `M${GX} ${base} L${end} ${base}`;
    case "blip":
      return `M${GX} ${base} L${PRESS} ${base} L${PRESS + 4} ${mid + 10} L${PRESS + 22} ${mid + 10} L${PRESS + 26} ${base} L${end} ${base}`;
    case "stuck":
      return `M${GX} ${base} L${PRESS} ${base} L${PRESS + 8} ${mid} L${end} ${mid}`;
    case "loop": {
      // Two boot attempts: rise, wobble, drop.
      const attempt = (x: number) =>
        `L${x} ${base} L${x + 5} ${mid} l8 -8 l8 10 l8 -12 l8 9 l8 -6 L${x + 50} ${base}`;
      return `M${GX} ${base} L${PRESS} ${base} ${attempt(PRESS)} ${attempt(PRESS + 62)} L${end} ${base}`;
    }
  }
}

export function CurrentPatternsDiagram() {
  return (
    <svg viewBox={`0 0 440 ${patterns.length * ROW + 24}`} className="mx-auto w-full max-w-lg" role="img" aria-labelledby="cp-title">
      <title id="cp-title">
        {`Educational illustration of five bench power supply current patterns over time, with no values: ${patterns
          .map((p) => `${p.title}, which suggests ${p.lines.join(" ").replace("…", "")}`)
          .join("; ")}.`}
      </title>
      {patterns.map((p, i) => {
        const y = i * ROW + 8;
        const base = y + 66;
        const top = y + 14;
        return (
          <g key={p.shape}>
            {i > 0 && <line x1={10} y1={y - 4} x2={430} y2={y - 4} className="stroke-line" />}
            {/* Axes */}
            <line x1={GX} y1={top - 4} x2={GX} y2={base} className="stroke-line-strong" strokeWidth={1.5} />
            <line x1={GX} y1={base} x2={GX + GW} y2={base} className="stroke-line-strong" strokeWidth={1.5} />
            {/* Power key press, and the current limit for the first pattern */}
            <line x1={PRESS} y1={top - 4} x2={PRESS} y2={base} className="stroke-faint" strokeDasharray="3 3" />
            {p.shape === "early" && (
              <>
                <line x1={GX} y1={top} x2={GX + GW} y2={top} className="stroke-red-400/60" strokeDasharray="5 4" />
                <text x={GX + GW} y={top - 4} textAnchor="end" className="fill-red-400" fontSize={10}>
                  current limit
                </text>
              </>
            )}
            <path d={trace(p.shape, base, top)} fill="none" className="stroke-data" strokeWidth={2.5} strokeLinejoin="round" />
            <text x={PRESS + 3} y={base + 14} className="fill-faint" fontSize={10}>
              power pressed
            </text>

            <text x={220} y={y + 28} className="fill-ink font-semibold" fontSize={13.5}>
              {p.title}
            </text>
            {p.lines.map((line, j) => (
              <text key={line} x={220} y={y + 48 + j * 17} className="fill-muted" fontSize={12}>
                {line}
              </text>
            ))}
          </g>
        );
      })}
      <text x={GX} y={patterns.length * ROW + 18} className="fill-faint" fontSize={10.5}>
        Up: current · Right: time · Shapes only, no values
      </text>
    </svg>
  );
}
