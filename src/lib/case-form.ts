import type {
  ChipsetPlatform,
  ConfidenceLevel,
  MeasurementMode,
  RepairMeasurement,
  RepairSource,
} from "./types";

/*
 * The repair-case editor's data and its validation.
 * Shared by the member submission form and the reviewer form; the server
 * actions re-validate everything, so the rules can't be bypassed from the browser.
 */

export type CaseDraft = {
  id?: string;
  title: string;
  summary: string;
  brand: string;
  model: string;
  platform: ChipsetPlatform | "";
  chipset: string;
  boardRevision: string;
  faultCategory: string;
  symptoms: string[];
  initialChecks: string[];
  measurements: RepairMeasurement[];
  diagnosticSteps: string[];
  rootCause: string;
  repairProcedure: string[];
  verification: string[];
  sources: RepairSource[];
  confidence: ConfidenceLevel;
  confidenceNote: string;
  relatedBlocks: string[];
};

export const emptyDraft: CaseDraft = {
  title: "",
  summary: "",
  brand: "",
  model: "",
  platform: "",
  chipset: "",
  boardRevision: "",
  faultCategory: "",
  symptoms: [],
  initialChecks: [],
  measurements: [],
  diagnosticSteps: [],
  rootCause: "",
  repairProcedure: [],
  verification: [],
  sources: [],
  confidence: "unverified",
  confidenceNote: "",
  relatedBlocks: [],
};

export type FieldErrors = Partial<Record<keyof CaseDraft | "form", string>>;

const platforms: ChipsetPlatform[] = ["mediatek", "qualcomm", "exynos", "unisoc", "apple"];
const confidences: ConfidenceLevel[] = ["verified", "corroborated", "hypothesis", "unverified"];
const modes: MeasurementMode[] = ["dc-voltage", "diode", "resistance", "continuity", "current", "other"];
const sourceKinds: RepairSource["kind"][] = ["documentation", "practical", "forum", "video", "other"];
export const MEMBER_CONFIDENCE: ConfidenceLevel[] = ["hypothesis", "unverified"];

const MAX_ITEMS = 30;
const MAX_ITEM_LENGTH = 500;

const str = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();

/** Textareas hold one item per line. */
function lines(formData: FormData, name: string) {
  return str(formData, name)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function json<T>(formData: FormData, name: string): T[] {
  try {
    const value: unknown = JSON.parse(str(formData, name) || "[]");
    return Array.isArray(value) ? (value as T[]) : [];
  } catch {
    return [];
  }
}

const clean = (value: unknown, max = MAX_ITEM_LENGTH) => String(value ?? "").trim().slice(0, max);

/** Reads the editor's form fields into a draft. Nothing is validated yet. */
export function readCaseForm(formData: FormData): CaseDraft {
  return {
    id: str(formData, "id") || undefined,
    title: str(formData, "title"),
    summary: str(formData, "summary"),
    brand: str(formData, "brand"),
    model: str(formData, "model"),
    platform: (platforms.includes(str(formData, "platform") as ChipsetPlatform) ? str(formData, "platform") : "") as CaseDraft["platform"],
    chipset: str(formData, "chipset"),
    boardRevision: str(formData, "boardRevision"),
    faultCategory: str(formData, "faultCategory"),
    symptoms: lines(formData, "symptoms"),
    initialChecks: lines(formData, "initialChecks"),
    measurements: json<RepairMeasurement>(formData, "measurements")
      .map((m) => ({
        point: clean(m.point),
        mode: (modes.includes(m.mode) ? m.mode : "other") as MeasurementMode,
        condition: clean(m.condition),
        observed: clean(m.observed),
        reference: clean(m.reference),
      }))
      .filter((m) => m.point || m.observed || m.condition || m.reference),
    diagnosticSteps: lines(formData, "diagnosticSteps"),
    rootCause: str(formData, "rootCause"),
    repairProcedure: lines(formData, "repairProcedure"),
    verification: lines(formData, "verification"),
    sources: json<RepairSource>(formData, "sources")
      .map((s) => ({
        title: clean(s.title, 200),
        url: clean(s.url, 500) || undefined,
        kind: (sourceKinds.includes(s.kind) ? s.kind : "other") as RepairSource["kind"],
        note: clean(s.note) || undefined,
      }))
      .filter((s) => s.title || s.url || s.note),
    confidence: (confidences.includes(str(formData, "confidence") as ConfidenceLevel) ? str(formData, "confidence") : "unverified") as ConfidenceLevel,
    confidenceNote: str(formData, "confidenceNote"),
    relatedBlocks: formData.getAll("relatedBlocks").map(String).slice(0, 12),
  };
}

const isHttpUrl = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};

/**
 * Checks a draft.
 * - "draft": the minimum the database needs to store it.
 * - "submit": complete enough for a reviewer to assess.
 * - "publish": also enforces the source rules for Verified and Corroborated.
 */
export function validateCase(
  d: CaseDraft,
  level: "draft" | "submit" | "publish",
  options: { faultCategoryIds: string[]; allowedConfidence: ConfidenceLevel[] },
): FieldErrors {
  const e: FieldErrors = {};
  if (d.title.length < 5 || d.title.length > 160) e.title = "Give the case a title of 5–160 characters.";
  if (d.summary.length > 500) e.summary = "Keep the summary under 500 characters.";
  if (!d.brand || d.brand.length > 60) e.brand = "Enter the manufacturer (up to 60 characters).";
  if (!d.model || d.model.length > 100) e.model = "Enter the exact phone model (up to 100 characters).";
  if (!d.platform) e.platform = "Choose the chipset platform.";
  if (d.chipset.length > 80) e.chipset = "Chipset name is too long.";
  if (d.boardRevision.length > 60) e.boardRevision = "Board revision is too long.";
  if (!options.faultCategoryIds.includes(d.faultCategory)) e.faultCategory = "Choose a fault category.";
  if (!options.allowedConfidence.includes(d.confidence)) {
    e.confidence = "Only a reviewer can mark a case Verified or Corroborated.";
  }

  for (const key of ["symptoms", "initialChecks", "diagnosticSteps", "repairProcedure", "verification"] as const) {
    if (d[key].length > MAX_ITEMS) e[key] = `Up to ${MAX_ITEMS} lines.`;
    else if (d[key].some((l) => l.length > MAX_ITEM_LENGTH)) e[key] = `Each line can be up to ${MAX_ITEM_LENGTH} characters.`;
  }
  if (d.rootCause.length > 1000) e.rootCause = "Keep the root cause under 1000 characters.";
  if (d.measurements.length > MAX_ITEMS) e.measurements = `Up to ${MAX_ITEMS} measurements.`;
  else if (d.measurements.some((m) => !m.point || !m.condition || !m.observed)) {
    e.measurements = "Each measurement needs a point, the board's condition, and what you observed.";
  }
  if (d.sources.some((s) => !s.title)) e.sources = "Each source needs a title.";
  else if (d.sources.some((s) => s.url && !isHttpUrl(s.url))) e.sources = "Source links must start with http:// or https://.";

  if (level !== "draft") {
    if (!d.summary) e.summary = "Add a short summary.";
    if (d.symptoms.length === 0) e.symptoms = "List at least one symptom.";
    if (d.diagnosticSteps.length === 0) e.diagnosticSteps = "Describe at least one diagnostic step.";
  }
  if (level === "publish") {
    if (d.confidence === "verified" && d.sources.length < 1) {
      e.sources = "A Verified case needs at least one source (documentation or repeatable practical evidence).";
    }
    if (d.confidence === "corroborated" && d.sources.length < 2) {
      e.sources = "A Corroborated case needs at least two independent sources.";
    }
    if (!d.confidenceNote) e.confidenceNote = "Explain why this confidence level was given.";
  }
  return e;
}

/** URL-safe id for a new case, e.g. "samsung-a12-no-power-after-liquid-3f9a". */
export function makeSlug(d: CaseDraft, suffix: string) {
  const base = `${d.brand} ${d.model} ${d.title}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70)
    .replace(/-$/, "");
  return `${base || "case"}-${suffix}`;
}
