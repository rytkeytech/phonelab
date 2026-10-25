import type {
  ChallengeSummary,
  Course,
  LessonSummary,
  RepairCaseSummary,
} from "@/lib/types";

/*
 * SAMPLE DATA for the UI preview.
 * Devices are fictional ("Demo Phone") and no case is marked Verified,
 * because none of these have real evidence behind them.
 * This file will be replaced by Supabase queries in Stage 3.
 */

export const courses: Course[] = [
  { id: "fundamentals", order: 1, title: "Electronics fundamentals", description: "Voltage, current, resistance, components and using a multimeter.", lessonCount: 8 },
  { id: "power", order: 2, title: "Smartphone power systems", description: "Battery, charging, PMIC, rails and current-draw diagnosis.", lessonCount: 7 },
  { id: "boot", order: 3, title: "Boot sequence and startup", description: "From power key press to the OS: what happens and in what order.", lessonCount: 6 },
  { id: "clocks", order: 4, title: "Clocks and reset", description: "Crystals, oscillators, reset lines and why they stop a board booting.", lessonCount: 4 },
  { id: "memory", order: 5, title: "RAM and storage", description: "LPDDR, eMMC, UFS, PoP packages and memory-related faults.", lessonCount: 5 },
  { id: "buses", order: 6, title: "SoC and peripheral communication", description: "I²C, SPI, MIPI and how the SoC talks to everything else.", lessonCount: 6 },
  { id: "platforms", order: 7, title: "Platform-specific architecture", description: "How MediaTek, Snapdragon, Exynos, UNISOC and Apple designs differ.", lessonCount: 5 },
  { id: "diagnosis", order: 8, title: "Practical fault diagnosis", description: "A systematic workflow from symptom to verified repair.", lessonCount: 7 },
];

/** Sample progress: completed lessons per course id. */
export const sampleProgress: Record<string, number> = {
  fundamentals: 8,
  power: 4,
  boot: 1,
};

export const recommendedLessons: LessonSummary[] = [
  { id: "power-5", courseId: "power", title: "Reading current draw on a DC power supply", minutes: 12, difficulty: "intermediate" },
  { id: "boot-2", courseId: "boot", title: "What the PMIC does in the first second", minutes: 9, difficulty: "beginner" },
  { id: "fundamentals-7", courseId: "fundamentals", title: "Diode mode: finding shorts safely", minutes: 10, difficulty: "beginner" },
];

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
