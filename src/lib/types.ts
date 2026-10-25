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
  id: string;
  order: number;
  title: string;
  description: string;
  lessonCount: number;
};

export type LessonSummary = {
  id: string;
  courseId: string;
  title: string;
  minutes: number;
  difficulty: Difficulty;
};

// ---- Repairs ----

export type RepairCaseSummary = {
  id: string;
  title: string;
  brand: string;
  model: string;
  platform: ChipsetPlatform;
  faultCategory: string;
  confidence: ConfidenceLevel;
};

// ---- Diagnostic game ----

export type ChallengeSummary = {
  id: string;
  title: string;
  symptom: string;
  difficulty: Difficulty;
  steps: number;
};
