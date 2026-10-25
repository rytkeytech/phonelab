const ROW = 62;

const stages: { title: string; detail: string; tag: string; tone: string }[] = [
  { title: "Power key", detail: "Signal reaches power management", tag: "PMIC", tone: "power" },
  { title: "Power-on sequence", detail: "Rails switch on in order", tag: "PMIC", tone: "power" },
  { title: "Clocks start", detail: "Reference clocks begin running", tag: "Clock", tone: "clock" },
  { title: "Reset released", detail: "SoC is allowed to start", tag: "Reset", tone: "clock" },
  { title: "Boot ROM", detail: "Built-in code looks for a bootloader", tag: "SoC", tone: "accent" },
  { title: "Bootloaders", detail: "Load from storage, set up RAM", tag: "Storage · RAM", tone: "corroborated" },
  { title: "Operating system", detail: "Drivers bring up peripherals", tag: "OS", tone: "muted" },
];

const toneClass: Record<string, { stroke: string; fill: string }> = {
  power: { stroke: "stroke-power", fill: "fill-power" },
  clock: { stroke: "stroke-clock", fill: "fill-clock" },
  accent: { stroke: "stroke-accent", fill: "fill-accent" },
  corroborated: { stroke: "stroke-corroborated", fill: "fill-corroborated" },
  muted: { stroke: "stroke-muted", fill: "fill-muted" },
};

export function BootSequenceDiagram() {
  const height = 20 + stages.length * ROW;
  return (
    <svg viewBox={`0 0 420 ${height}`} className="mx-auto w-full max-w-md" role="img" aria-labelledby="boot-title">
      <title id="boot-title">
        {`Conceptual boot sequence: ${stages.map((s) => s.title).join(", then ")}.`}
      </title>
      <line x1={30} y1={34} x2={30} y2={34 + (stages.length - 1) * ROW} className="stroke-line-strong" strokeWidth={2} />
      {stages.map((stage, i) => {
        const y = 14 + i * ROW;
        const tone = toneClass[stage.tone];
        return (
          <g key={stage.title}>
            <circle cx={30} cy={y + 20} r={15} className={`fill-surface ${tone.stroke}`} strokeWidth={2} />
            <text x={30} y={y + 25} textAnchor="middle" className={`font-mono ${tone.fill}`} fontSize={13}>
              {i + 1}
            </text>
            <text x={58} y={y + 16} className="fill-ink font-semibold" fontSize={14.5}>
              {stage.title}
            </text>
            <text x={58} y={y + 35} className="fill-muted" fontSize={12}>
              {stage.detail}
            </text>
            <rect x={318} y={y + 6} width={94} height={24} rx={12} className={`fill-raised ${tone.stroke}`} strokeOpacity={0.5} />
            <text x={365} y={y + 22} textAnchor="middle" className={`font-mono ${tone.fill}`} fontSize={11}>
              {stage.tag}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
