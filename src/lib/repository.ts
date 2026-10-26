import "server-only";
import { getSampleCase, sampleRepairCases } from "@/data/repairs";
import { getPublishedCase, getPublishedCases } from "./repair-cases";
import type { RepairCase } from "./types";

/*
 * The Repair Repository's cases: reviewed cases published in Supabase,
 * followed by the clearly-labelled fictional samples.
 */

export async function getAllRepairCases(): Promise<RepairCase[]> {
  return [...(await getPublishedCases()), ...sampleRepairCases];
}

/** A case by URL id. `rowId` is set for database cases (used to load their photos). */
export async function findRepairCase(id: string): Promise<{ repairCase: RepairCase; rowId?: string } | null> {
  const sample = getSampleCase(id);
  if (sample) return { repairCase: sample };
  return getPublishedCase(id);
}

export async function getLatestRepairCases(limit: number) {
  const all = await getAllRepairCases();
  return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, limit);
}
