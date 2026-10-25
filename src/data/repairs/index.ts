import { sampleRepairCases } from "./sample-cases";

/*
 * Repair cases. Sample data for now; replaced by published rows from the
 * Supabase repair_cases table once the database is connected.
 */

export { faultCategories, faultCategoryLabel, measurementModeLabels, platformNames } from "./taxonomy";

export const repairCases = sampleRepairCases;

export function getRepairCase(id: string) {
  return repairCases.find((c) => c.id === id);
}

export function getLatestRepairCases(limit: number) {
  return [...repairCases].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, limit);
}
