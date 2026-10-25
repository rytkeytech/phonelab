import type { LessonDiagramId } from "@/lib/types";
import { BootSequenceDiagram } from "./BootSequenceDiagram";
import { DiodeModeDiagram } from "./DiodeModeDiagram";
import { PowerPathDiagram } from "./PowerPathDiagram";

export const lessonDiagrams: Record<LessonDiagramId, () => React.ReactNode> = {
  "power-path": PowerPathDiagram,
  "boot-sequence": BootSequenceDiagram,
  "diode-mode": DiodeModeDiagram,
};
