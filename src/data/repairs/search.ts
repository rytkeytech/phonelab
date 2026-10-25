import type { ConfidenceLevel, RepairCase } from "@/lib/types";

/** Repository filters. Also stored in the URL so searches can be shared. */
export type RepairFilters = {
  q: string;
  /** Which text the search looks in */
  scope: "all" | "symptoms" | "diagnosis";
  brand: string;
  model: string;
  platform: string;
  category: string;
  confidence: ConfidenceLevel[];
  sort: "recent" | "title";
};

export const emptyFilters: RepairFilters = {
  q: "",
  scope: "all",
  brand: "",
  model: "",
  platform: "",
  category: "",
  confidence: [],
  sort: "recent",
};

const confidenceLevels: ConfidenceLevel[] = ["verified", "corroborated", "hypothesis", "unverified"];

function searchableText(c: RepairCase, scope: RepairFilters["scope"]) {
  const symptoms = c.symptoms;
  const diagnosis = [...c.initialChecks, ...c.diagnosticSteps, c.rootCause ?? "", ...c.measurements.map((m) => `${m.point} ${m.observed}`)];
  const parts =
    scope === "symptoms" ? symptoms
    : scope === "diagnosis" ? diagnosis
    : [c.title, c.summary, c.brand, c.model, c.chipset ?? "", ...symptoms, ...diagnosis, ...c.repairProcedure];
  return parts.join(" ").toLowerCase();
}

export function filterRepairCases(cases: RepairCase[], f: RepairFilters) {
  const terms = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  const result = cases.filter(
    (c) =>
      (!f.brand || c.brand === f.brand) &&
      (!f.model || c.model === f.model) &&
      (!f.platform || c.platform === f.platform) &&
      (!f.category || c.faultCategory === f.category) &&
      (f.confidence.length === 0 || f.confidence.includes(c.confidence)) &&
      (terms.length === 0 || terms.every((t) => searchableText(c, f.scope).includes(t))),
  );
  return result.sort((a, b) =>
    f.sort === "title" ? a.title.localeCompare(b.title) : b.updatedAt.localeCompare(a.updatedAt),
  );
}

/** Number of filters (excluding sort) currently narrowing the results. */
export function activeFilterCount(f: RepairFilters) {
  return [f.q, f.brand, f.model, f.platform, f.category].filter(Boolean).length + (f.confidence.length > 0 ? 1 : 0);
}

export function filtersToSearchParams(f: RepairFilters) {
  const params = new URLSearchParams();
  if (f.q) params.set("q", f.q);
  if (f.scope !== "all") params.set("in", f.scope);
  if (f.brand) params.set("brand", f.brand);
  if (f.model) params.set("model", f.model);
  if (f.platform) params.set("platform", f.platform);
  if (f.category) params.set("category", f.category);
  if (f.confidence.length) params.set("confidence", f.confidence.join(","));
  if (f.sort !== "recent") params.set("sort", f.sort);
  return params;
}

/** Reads filters from the URL, ignoring anything invalid. */
export function filtersFromSearchParams(params: URLSearchParams): RepairFilters {
  const scope = params.get("in");
  const sort = params.get("sort");
  return {
    q: params.get("q") ?? "",
    scope: scope === "symptoms" || scope === "diagnosis" ? scope : "all",
    brand: params.get("brand") ?? "",
    model: params.get("model") ?? "",
    platform: params.get("platform") ?? "",
    category: params.get("category") ?? "",
    confidence: (params.get("confidence") ?? "")
      .split(",")
      .filter((c): c is ConfidenceLevel => confidenceLevels.includes(c as ConfidenceLevel)),
    sort: sort === "title" ? "title" : "recent",
  };
}
