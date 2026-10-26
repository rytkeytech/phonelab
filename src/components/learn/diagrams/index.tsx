import type { LessonDiagramId } from "@/lib/types";
import { BootSequenceDiagram } from "./BootSequenceDiagram";
import { CircuitStatesDiagram } from "./CircuitStatesDiagram";
import { ClockFaultFlowDiagram } from "./ClockFaultFlowDiagram";
import { CrystalOscillatorDiagram } from "./CrystalOscillatorDiagram";
import { CurrentPatternsDiagram } from "./CurrentPatternsDiagram";
import { DiodeModeDiagram } from "./DiodeModeDiagram";
import { MeasurementSetupDiagram } from "./MeasurementSetupDiagram";
import { MultimeterDiagram } from "./MultimeterDiagram";
import { PowerPathDiagram } from "./PowerPathDiagram";
import { ResetTimingDiagram } from "./ResetTimingDiagram";
import { RtcDividerDiagram } from "./RtcDividerDiagram";
import { WatchdogDiagram } from "./WatchdogDiagram";

/**
 * What kind of visual a diagram is. Shown on every figure, so an illustration
 * is never mistaken for a real schematic.
 */
export type DiagramKind = "illustration" | "conceptual" | "flow";

export const diagramKindLabel: Record<DiagramKind, string> = {
  illustration: "Educational illustration",
  conceptual: "Conceptual diagram",
  flow: "Process flow",
};

export const lessonDiagrams: Record<LessonDiagramId, { Diagram: () => React.ReactNode; kind: DiagramKind }> = {
  "power-path": { Diagram: PowerPathDiagram, kind: "conceptual" },
  "boot-sequence": { Diagram: BootSequenceDiagram, kind: "flow" },
  "diode-mode": { Diagram: DiodeModeDiagram, kind: "illustration" },
  "circuit-states": { Diagram: CircuitStatesDiagram, kind: "illustration" },
  multimeter: { Diagram: MultimeterDiagram, kind: "illustration" },
  "measurement-setup": { Diagram: MeasurementSetupDiagram, kind: "illustration" },
  "current-patterns": { Diagram: CurrentPatternsDiagram, kind: "illustration" },
  "crystal-oscillator": { Diagram: CrystalOscillatorDiagram, kind: "conceptual" },
  "rtc-divider": { Diagram: RtcDividerDiagram, kind: "illustration" },
  "reset-timing": { Diagram: ResetTimingDiagram, kind: "conceptual" },
  watchdog: { Diagram: WatchdogDiagram, kind: "flow" },
  "clock-fault-flow": { Diagram: ClockFaultFlowDiagram, kind: "flow" },
};
