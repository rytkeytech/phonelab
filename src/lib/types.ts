/*
 * Shared types. These mirror the planned Supabase tables so the sample data
 * can later be swapped for database queries without rewriting the pages.
 */

export type ConfidenceLevel =
  | "verified"
  | "corroborated"
  | "hypothesis"
  | "unverified";

export type ChipsetPlatform =
  | "mediatek"
  | "qualcomm"
  | "exynos"
  | "unisoc"
  | "apple";

export type Difficulty = "beginner" | "intermediate" | "advanced";

// ---- Chipset Explorer (conceptual) ----

export type BlockCategory = "core" | "power" | "memory" | "timing" | "peripheral";

export type SignalType = "power" | "data" | "control" | "clock";

export type ChipsetBlock = {
  id: string;
  name: string;
  /** Short label drawn inside the diagram box */
  label: string;
  category: BlockCategory;
  summary: string;
  functions: string[];
  /** Ids of blocks this block needs in order to work */
  dependsOn: string[];
  symptoms: string[];
  diagnosis: string[];
  /** Extra caution shown in the detail panel, if any */
  caution?: string;
  /** Position in the SVG viewBox */
  box: { x: number; y: number; w: number; h: number };
};

export type ChipsetConnection = {
  id: string;
  from: string;
  to: string;
  type: SignalType;
  label: string;
  /** Polyline points in the SVG viewBox, from the "from" block to the "to" block */
  points: [number, number][];
};

// ---- Learning ----

export type Course = {
  /** Also used as the URL segment: /learn/[course] */
  id: string;
  order: number;
  title: string;
  description: string;
};

/** Diagrams that lesson content can embed by id. */
export type LessonDiagramId = "power-path" | "boot-sequence" | "diode-mode";

/** One piece of lesson content. Lessons are an ordered list of these. */
export type LessonBlock =
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; tone: "key" | "tip" | "caution"; title: string; text: string }
  | { type: "example"; title: string; steps: string[]; note?: string }
  | { type: "diagram"; diagram: LessonDiagramId; caption: string }
  | { type: "explorer"; blockId: string; text: string };

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  /** Shown after answering, whether right or wrong */
  explanation: string;
};

export type Lesson = {
  /** Unique across all courses: "<courseId>/<slug>" */
  id: string;
  courseId: string;
  /** URL segment: /learn/[course]/[lesson] */
  slug: string;
  order: number;
  title: string;
  summary: string;
  minutes: number;
  difficulty: Difficulty;
  /** Planned lessons appear in the outline but have no content yet */
  status: "published" | "planned";
  objectives: string[];
  blocks: LessonBlock[];
  quiz: QuizQuestion[];
};

// ---- Repairs ----

export type FaultCategory = {
  id: string;
  label: string;
};

export type MeasurementMode = "dc-voltage" | "diode" | "resistance" | "continuity" | "current" | "other";

/** One recorded measurement. Conditions are required so readings can be compared fairly. */
export type RepairMeasurement = {
  /** Where it was taken, described from the schematic or boardview */
  point: string;
  mode: MeasurementMode;
  /** Board state, e.g. "Battery disconnected" or "DC supply, pressing power" */
  condition: string;
  observed: string;
  /** What a known-good board showed, or why there is no reference */
  reference: string;
};

export type RepairMedia = {
  id: string;
  url: string;
  caption: string;
  kind: "photo" | "thermal" | "diagram" | "other";
};

export type RepairSource = {
  title: string;
  url?: string;
  kind: "documentation" | "practical" | "forum" | "video" | "other";
  note?: string;
};

export type RepairCase = {
  /** Also the URL segment: /repairs/[caseId] */
  id: string;
  title: string;
  summary: string;
  brand: string;
  model: string;
  /** null when the board revision wasn't recorded */
  boardRevision: string | null;
  platform: ChipsetPlatform;
  chipset: string | null;
  faultCategory: string;
  symptoms: string[];
  initialChecks: string[];
  measurements: RepairMeasurement[];
  diagnosticSteps: string[];
  /** null when the root cause hasn't been determined */
  rootCause: string | null;
  repairProcedure: string[];
  verification: string[];
  media: RepairMedia[];
  sources: RepairSource[];
  confidence: ConfidenceLevel;
  /** Why this confidence level was given */
  confidenceNote: string;
  /** Chipset Explorer block ids this case relates to */
  relatedBlocks: string[];
  /** Fictional teaching case, not a real repair */
  isSample: boolean;
  updatedAt: string;
};

// ---- Diagnostic game ----

export type ChallengeSummary = {
  id: string;
  title: string;
  symptom: string;
  difficulty: Difficulty;
  steps: number;
};
