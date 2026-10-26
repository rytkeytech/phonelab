import { sampleRepairCases } from "./sample-cases";

/*
 * Fictional sample cases that demonstrate the format. Real cases live in
 * Supabase; src/lib/repository.ts combines both for the repository pages.
 */

export { faultCategories, faultCategoryLabel, measurementModeLabels, platformNames } from "./taxonomy";

export { sampleRepairCases };

export function getSampleCase(id: string) {
  return sampleRepairCases.find((c) => c.id === id);
}
