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
  /** Research claims (ids from src/data/research/claims.ts) behind statements in this block */
  claims?: string[];
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
export type LessonDiagramId =
  | "power-path"
  | "boot-sequence"
  | "diode-mode"
  | "circuit-states"
  | "multimeter"
  | "measurement-setup"
  | "current-patterns"
  | "crystal-oscillator"
  | "rtc-divider"
  | "reset-timing"
  | "watchdog"
  | "clock-fault-flow"
  | "resistor-jobs"
  | "resistor-marking"
  | "series-parallel"
  | "parallel-on-board"
  | "voltage-divider"
  | "key-ladder"
  | "logic-levels"
  | "pull-resistors"
  | "open-drain-bus"
  | "ldo-block"
  | "ldo-dropout"
  | "ldo-fault-flow"
  | "crystal-circuit";

/**
 * One piece of lesson content. Lessons are an ordered list of these.
 * `claims` lists research claim ids that back the block; each is cited right under it.
 */
export type LessonBlock = (
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; tone: "key" | "tip" | "caution"; title: string; text: string }
  | { type: "example"; title: string; steps: string[]; note?: string }
  | { type: "diagram"; diagram: LessonDiagramId; caption: string }
  | { type: "explorer"; blockId: string; text: string }
) & { claims?: string[] };

// ---- Research (see docs/research/) ----

/** How a claim is supported. */
export type EvidenceType = "direct-source" | "corroborated" | "engineering-inference" | "general-principle";

/** Source priority from the research rules: 1 (manufacturer service docs) to 7 (standard references). */
export type SourceTier = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ResearchSource = {
  /** "S-0001" */
  id: string;
  title: string;
  publisher: string;
  /** URL or document number */
  location: string;
  tier: SourceTier;
  /** Whether the document was actually read, and when */
  access: { status: "read" | "unavailable"; date: string; note?: string };
};

export type ResearchClaim = {
  /** "C-0001" */
  id: string;
  statement: string;
  /** Sources that were read and support the claim, with page/section/figure */
  sources: { sourceId: string; locator: string }[];
  /** Device model and board revision, or "General principle" */
  appliesTo: string;
  /** What the sources actually establish (may be less than the statement) */
  establishes: string;
  evidence: EvidenceType;
  confidence: ConfidenceLevel;
  researched: string;
  limitations: string;
  /** Open question in docs/research/OPEN_QUESTIONS.md, while unresolved */
  questionId?: string;
};

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

/** How good a choice is. Best and reasonable choices move the scenario on; the others don't. */
export type ChoiceQuality = "best" | "ok" | "poor" | "unsafe";

/** A simulated meter or tool reading. Always shown labelled as simulated. */
export type SimulatedReading = {
  label: string;
  value: string;
  /** Simulated known-good comparison, if any */
  reference?: string;
};

export type GameChoice = {
  id: string;
  label: string;
  quality: ChoiceQuality;
  /** Why this choice is good or bad */
  feedback: string;
  /** What the technician learns from doing it (simulated) */
  finding?: string;
  reading?: SimulatedReading;
  /** Step to go to when this choice moves the case on: a step id, or "end". Default: the next step in the list. */
  next?: string;
  /** For interpretation steps: what the evidence so far does and doesn't show */
  interpretation?: {
    supports: string;
    doesNotProve: string;
    /** Causes still possible after this result */
    remaining: string[];
  };
};

/** The stages of a guided case, in order. Shown as the progress indicator. */
export type CasePhase =
  | "case"
  | "inspection"
  | "first-test"
  | "interpret"
  | "circuit"
  | "next-decision"
  | "confirmation"
  | "repair"
  | "verification"
  | "review";

export type GameStep = {
  id: string;
  /** Which stage of the case this step belongs to. Older linear scenarios leave it out. */
  phase?: CasePhase;
  /** Background shown above the question (what's on the bench, what the last test showed) */
  context?: string;
  /** The situation and question at this step */
  prompt: string;
  /** Optional nudge. Revealing it costs a couple of points. */
  hint?: string;
  /**
   * A detour off the best path. Choices still get feedback and unsafe ones still
   * lose points, but nothing here adds points, so a longer route can't outscore the best one.
   */
  unscored?: boolean;
  /** Circuit view for this step. Always labelled with its mode. */
  circuit?: { mode: "conceptual"; diagram: LessonDiagramId; caption: string };
  choices: GameChoice[];
};

export type GameScenario = {
  /** Also the URL segment: /diagnose/[scenarioId] */
  id: string;
  title: string;
  symptom: string;
  difficulty: Difficulty;
  /** The customer's report, as they'd say it */
  brief: string;
  /** Describes the simulated device without claiming to be a real model */
  device: string;
  /** "documented" only when a source shows the repair really happened. Default: simulated. */
  kind?: "simulated" | "documented";
  /** What the technician sees on first look, before any test */
  observations?: string[];
  steps: GameStep[];
  debrief: {
    rootCause: string;
    lessons: string[];
    /** Other causes that could produce the same symptom, and how this case ruled them out */
    alternatives?: string[];
    /** Mistakes technicians commonly make on this kind of fault */
    commonMistakes?: string[];
  };
  relatedLessonIds: string[];
  relatedBlocks: string[];
};
