import { ArrowMarker, DiagramNode } from "./DiagramNode";

/*
 * Process flow: how a watchdog turns a software hang into a restart, and how a
 * hang that repeats at the same point becomes a boot loop.
 */

export function WatchdogDiagram() {
  const arrow = "url(#wd-arrow)";
  const red = "url(#wd-arrow-red)";
  return (
    <svg viewBox="0 0 440 300" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="wd-title">
      <title id="wd-title">
        Process flow. While software runs normally it keeps restarting the watchdog timer, so nothing happens. If the
        software hangs, it stops restarting the timer, the timer runs out, and the watchdog restarts the system. If the
        same hang happens at the same point on every start, the phone restarts again and again: a boot loop.
      </title>
      <defs>
        <ArrowMarker id="wd-arrow" className="fill-muted" />
        <ArrowMarker id="wd-arrow-red" className="fill-red-400" />
      </defs>

      {/* Normal loop */}
      <DiagramNode x={20} y={20} w={170} h={54} title="Software running" subtitle="normally" className="stroke-verified" />
      <DiagramNode x={250} y={20} w={170} h={54} title="Restarts the timer" subtitle="&quot;kicks&quot; the watchdog" className="stroke-verified" />
      {/* Two arrows between the boxes: kick, then carry on running */}
      <path d="M190 36 L246 36" className="stroke-verified" strokeWidth={2} markerEnd={arrow} />
      <path d="M250 60 L194 60" className="stroke-verified" strokeWidth={2} markerEnd={arrow} />
      <text x={220} y={100} textAnchor="middle" className="fill-muted" fontSize={11.5}>
        repeats: nothing happens
      </text>

      {/* Hang path */}
      <DiagramNode x={20} y={146} w={170} h={54} title="Software hangs" subtitle="stops restarting it" className="stroke-red-400" />
      <DiagramNode x={250} y={146} w={170} h={54} title="Timer runs out" subtitle="watchdog restarts phone" className="stroke-red-400" />
      <path d="M105 74 L105 142" fill="none" className="stroke-red-400" strokeWidth={2} strokeDasharray="5 4" markerEnd={red} />
      <path d="M190 172 L246 172" className="stroke-red-400" strokeWidth={2} markerEnd={red} />

      <path d="M335 200 L335 232 L105 232 L105 204" fill="none" className="stroke-red-400" strokeWidth={2} markerEnd={red} />
      <text x={220} y={252} textAnchor="middle" className="fill-red-400" fontSize={12}>
        Same hang every start → boot loop
      </text>
      <text x={220} y={284} textAnchor="middle" className="fill-faint" fontSize={10.5}>
        A loop shows a repeating hang, not which part causes it
      </text>
    </svg>
  );
}
