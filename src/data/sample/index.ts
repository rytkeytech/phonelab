import type { ChallengeSummary, RepairCaseSummary } from "@/lib/types";

/*
 * SAMPLE DATA for the UI preview.
 * Devices are fictional ("Demo Phone") and no case is marked Verified,
 * because none of these have real evidence behind them.
 * Replaced by Supabase queries later in Stage 3.
 * (Learning content and progress are real: see src/data/learning.)
 */

export const recentRepairCases: RepairCaseSummary[] = [
  { id: "sample-001", title: "No power after liquid exposure, short on main supply line", brand: "Demo", model: "Demo Phone A", platform: "mediatek", faultCategory: "No power", confidence: "hypothesis" },
  { id: "sample-002", title: "Charging icon shows but battery percentage never rises", brand: "Demo", model: "Demo Phone B", platform: "qualcomm", faultCategory: "Charging", confidence: "unverified" },
  { id: "sample-003", title: "Boot loop after drop, suspected memory solder fault", brand: "Demo", model: "Demo Phone C", platform: "unisoc", faultCategory: "Boot", confidence: "hypothesis" },
];

export const challenges: ChallengeSummary[] = [
  { id: "dead-after-charge", title: "The phone that died on the charger", symptom: "No power, no current draw", difficulty: "beginner", steps: 5 },
  { id: "logo-loop", title: "Stuck at the logo", symptom: "Boot loop after a drop", difficulty: "intermediate", steps: 7 },
  { id: "no-wifi", title: "Wi-Fi won't switch on", symptom: "Wi-Fi toggle greyed out", difficulty: "advanced", steps: 8 },
];

export const sampleStats = {
  challengesSolved: 4,
  averageScore: 78,
  savedCases: 6,
};

export const platformNames = {
  mediatek: "MediaTek",
  qualcomm: "Snapdragon",
  exynos: "Exynos",
  unisoc: "UNISOC",
  apple: "Apple A-series",
} as const;
