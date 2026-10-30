import { Ground, KeyV, Node, ResistorV, Supply, Wire } from "./CircuitSymbols";

/*
 * Educational illustration of one open-drain line shared by three devices.
 * Each output is drawn as a switch to ground, which is how it behaves. Generic
 * device names; not a phone circuit.
 */

const BUS = 114;
const devices = [
  { x: 150, name: "Device A", closed: false },
  { x: 260, name: "Device B", closed: false },
  { x: 370, name: "Faulty device", closed: true },
];

export function OpenDrainBusDiagram() {
  return (
    <svg viewBox="0 0 440 292" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="od-title">
      <title id="od-title">
        One shared line lifted to the supply by a pull-up resistor. Three devices connect to it, each with a switch to
        ground. Two have let go, but the third is stuck on and holds the whole line low.
      </title>

      <Supply x={60} y={30} label="supply" />
      <Wire points={[[60, 30], [60, 40]]} />
      <ResistorV x={60} y={40} />
      <text x={76} y={68} className="fill-ink" fontSize={11.5}>
        pull-up
      </text>
      <Wire points={[[60, 88], [60, BUS]]} />
      <Wire points={[[28, BUS], [412, BUS]]} className="stroke-control" width={3} />
      <Node x={60} y={BUS} className="fill-control" />
      <text x={412} y={BUS - 10} textAnchor="end" className="fill-control" fontSize={11.5}>
        shared line (e.g. SDA)
      </text>

      {devices.map((d) => {
        const tone = d.closed ? "stroke-red-400" : "stroke-line-strong";
        return (
          <g key={d.name}>
            <Wire points={[[d.x, BUS], [d.x, 158]]} className={d.closed ? "stroke-red-400" : undefined} />
            <Node x={d.x} y={BUS} className={d.closed ? "fill-red-400" : "fill-ink"} />
            <rect x={d.x - 44} y={142} width={88} height={78} rx={6} className={`fill-surface ${tone}`} strokeWidth={1.5} />
            <text x={d.x} y={236} textAnchor="middle" className={d.closed ? "fill-red-400" : "fill-ink"} fontSize={11.5}>
              {d.name}
            </text>
            <KeyV x={d.x} y={158} closed={d.closed} className={d.closed ? "stroke-red-400" : "stroke-ink"} />
            <Wire points={[[d.x, 188], [d.x, 206]]} className={d.closed ? "stroke-red-400" : undefined} />
            <Ground x={d.x} y={206} />
          </g>
        );
      })}

      <text x={20} y={264} className="fill-ink" fontSize={12}>
        Any device can pull the line low. Only the resistor lifts it.
      </text>
      <text x={20} y={282} className="fill-red-400" fontSize={12}>
        One device stuck on holds the line low for all of them.
      </text>
    </svg>
  );
}
