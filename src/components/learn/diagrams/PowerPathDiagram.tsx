import { ArrowMarker, DiagramNode } from "./DiagramNode";

const arrow = "url(#pp-arrow)";

export function PowerPathDiagram() {
  return (
    <svg viewBox="0 0 420 484" className="mx-auto w-full max-w-md" role="img" aria-labelledby="pp-title">
      <title id="pp-title">
        Conceptual power path: USB input, protection, charging IC and battery feed the main system supply line,
        which feeds the PMIC and some loads directly; the PMIC makes rails for the SoC, memory and peripherals.
      </title>
      <defs>
        <ArrowMarker id="pp-arrow" className="fill-power" />
      </defs>

      <g className="stroke-power" strokeWidth={2} fill="none">
        <line x1={105} y1={68} x2={105} y2={98} markerEnd={arrow} />
        <line x1={105} y1={152} x2={105} y2={182} markerEnd={arrow} />
        <line x1={192} y1={210} x2={228} y2={210} markerStart={arrow} markerEnd={arrow} />
        <line x1={105} y1={236} x2={105} y2={266} markerEnd={arrow} />
        <line x1={315} y1={236} x2={315} y2={266} markerEnd={arrow} strokeDasharray="5 4" />
        <line x1={125} y1={312} x2={125} y2={344} markerEnd={arrow} />
        <line x1={325} y1={312} x2={325} y2={344} markerEnd={arrow} />
        <line x1={125} y1={398} x2={125} y2={428} markerEnd={arrow} />
      </g>
      <text x={322} y={255} className="fill-faint" fontSize={10.5}>varies</text>

      <DiagramNode x={20} y={16} w={170} h={52} title="USB input" subtitle="Port + filtering" />
      <DiagramNode x={20} y={100} w={170} h={52} title="Protection" subtitle="e.g. OVP (varies)" />
      <DiagramNode x={20} y={184} w={170} h={52} title="Charging IC" className="stroke-power/60" />
      <DiagramNode x={230} y={184} w={170} h={52} title="Battery" subtitle="Cell + pack protection" className="stroke-power/60" />
      <DiagramNode x={20} y={268} w={380} h={44} title="Main system supply line" subtitle="Name varies by platform" className="stroke-power" />
      <DiagramNode x={20} y={346} w={210} h={52} title="PMIC(s)" subtitle="Buck converters + LDOs" className="stroke-power/60" />
      <DiagramNode x={250} y={346} w={150} h={52} title="Some direct loads" subtitle="Varies by design" />
      <DiagramNode x={20} y={430} w={380} h={46} title="Rails → SoC, RAM, storage" subtitle="display, cameras, audio and more" className="stroke-accent/50" />
    </svg>
  );
}
