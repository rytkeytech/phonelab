/*
 * Conceptual timing diagram of power-on reset: supplies rise, the clock
 * starts, then reset is released and the SoC begins. Order and timing vary by
 * platform; no times or levels are shown.
 */

const LABEL_X = 12;
const X0 = 128; // traces start
const X1 = 428; // traces end
const T_STABLE = 200; // supplies stable
const T_CLOCK = 230; // clock running
const T_RELEASE = 300; // reset released

const rows = [
  { label: "Supply rails", y: 40, tone: "stroke-power", text: "fill-power" },
  { label: "Clock", y: 110, tone: "stroke-clock", text: "fill-clock" },
  { label: "Reset (active-low)", y: 180, tone: "stroke-control", text: "fill-control" },
];

const HIGH = -24; // offset from the row baseline for a high level

export function ResetTimingDiagram() {
  const [supply, clock, reset] = rows;
  // Clock: flat until it starts, then a square wave.
  let clockPath = `M${X0} ${clock.y} L${T_CLOCK} ${clock.y}`;
  for (let x = T_CLOCK, high = true; x < X1; x += 10, high = !high) {
    const y = clock.y + (high ? HIGH : 0);
    clockPath += ` L${x} ${y} L${Math.min(x + 10, X1)} ${y}`;
  }

  return (
    <svg viewBox="0 0 440 270" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="rt-title">
      <title id="rt-title">
        Conceptual power-on reset timing. The supply rails rise and become stable. Then the clock starts running. While
        this happens the active-low reset line is held low, keeping the chip in reset. Once supplies and clock are ready,
        reset goes high, which releases the chip, and the SoC starts its boot ROM. The order and timing vary by platform.
      </title>

      {rows.map((r) => (
        <text key={r.label} x={LABEL_X} y={r.y - 6} className={`${r.text} font-semibold`} fontSize={12}>
          {r.label}
        </text>
      ))}

      {/* Event markers */}
      {[
        { x: T_STABLE, label: "supplies stable" },
        { x: T_RELEASE, label: "reset released" },
      ].map((m) => (
        <g key={m.label}>
          <line x1={m.x} y1={8} x2={m.x} y2={200} className="stroke-faint" strokeDasharray="3 4" />
          <text x={m.x} y={222} textAnchor="middle" className="fill-muted" fontSize={11}>
            {m.label}
          </text>
        </g>
      ))}

      <g fill="none" strokeWidth={2.5} strokeLinejoin="round">
        <path d={`M${X0} ${supply.y} L${T_STABLE - 50} ${supply.y} L${T_STABLE} ${supply.y + HIGH} L${X1} ${supply.y + HIGH}`} className={supply.tone} />
        <path d={clockPath} className={clock.tone} />
        <path d={`M${X0} ${reset.y} L${T_RELEASE} ${reset.y} L${T_RELEASE} ${reset.y + HIGH} L${X1} ${reset.y + HIGH}`} className={reset.tone} />
      </g>

      <text x={(X0 + T_RELEASE) / 2} y={reset.y + 16} textAnchor="middle" className="fill-control" fontSize={10.5}>
        held in reset
      </text>
      <text x={T_RELEASE + 8} y={reset.y + HIGH - 8} className="fill-accent" fontSize={11}>
        SoC starts boot ROM →
      </text>

      <text x={X0} y={252} className="fill-faint" fontSize={10.5}>
        Order only. Timing and which chip drives reset vary.
      </text>
    </svg>
  );
}
