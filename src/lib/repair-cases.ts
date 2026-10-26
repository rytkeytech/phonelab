import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CaseDraft } from "./case-form";
import type { ChipsetPlatform, ConfidenceLevel, RepairCase, RepairMeasurement, RepairMedia, RepairSource } from "./types";
import { isSupabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/public";

/*
 * Repair cases stored in Supabase.
 * Published cases are read with the public client and cached under the
 * "repair-cases" tag (refreshed with updateTag when a reviewer publishes).
 * Unpublished cases are read with the signed-in user's client, so RLS
 * decides what each person may see.
 */

export const REPAIR_CASES_TAG = "repair-cases";

export type CaseStatus = "draft" | "submitted" | "changes_requested" | "published" | "rejected";

export const CASE_SELECT = "*, phone_models!inner(name, platform, chipset, brands!inner(name))";

export type CaseRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  board_revision: string | null;
  fault_category_id: string;
  symptoms: string[];
  initial_checks: string[];
  measurements: RepairMeasurement[];
  diagnostic_steps: string[];
  root_cause: string | null;
  repair_procedure: string[];
  verification: string[];
  sources: RepairSource[];
  confidence: ConfidenceLevel;
  confidence_note: string;
  related_blocks: string[];
  status: CaseStatus;
  submitted_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  phone_models: { name: string; platform: ChipsetPlatform; chipset: string | null; brands: { name: string } };
};

/** A database row in the shape the repository pages already use. */
export function toRepairCase(row: CaseRow): RepairCase {
  return {
    id: row.slug,
    title: row.title,
    summary: row.summary,
    brand: row.phone_models.brands.name,
    model: row.phone_models.name,
    boardRevision: row.board_revision,
    platform: row.phone_models.platform,
    chipset: row.phone_models.chipset,
    faultCategory: row.fault_category_id,
    symptoms: row.symptoms,
    initialChecks: row.initial_checks,
    measurements: row.measurements,
    diagnosticSteps: row.diagnostic_steps,
    rootCause: row.root_cause,
    repairProcedure: row.repair_procedure,
    verification: row.verification,
    media: [],
    sources: row.sources,
    confidence: row.confidence,
    confidenceNote: row.confidence_note,
    relatedBlocks: row.related_blocks,
    isSample: false,
    updatedAt: (row.published_at ?? row.updated_at).slice(0, 10),
  };
}

/** A database row as editor values. */
export function toDraft(row: CaseRow): CaseDraft {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    brand: row.phone_models.brands.name,
    model: row.phone_models.name,
    platform: row.phone_models.platform,
    chipset: row.phone_models.chipset ?? "",
    boardRevision: row.board_revision ?? "",
    faultCategory: row.fault_category_id,
    symptoms: row.symptoms,
    initialChecks: row.initial_checks,
    measurements: row.measurements,
    diagnosticSteps: row.diagnostic_steps,
    rootCause: row.root_cause ?? "",
    repairProcedure: row.repair_procedure,
    verification: row.verification,
    sources: row.sources,
    confidence: row.confidence,
    confidenceNote: row.confidence_note,
    relatedBlocks: row.related_blocks,
  };
}

/** All published cases, newest first. Cached; shared by every visitor. */
export async function getPublishedCases(): Promise<RepairCase[]> {
  "use cache";
  cacheTag(REPAIR_CASES_TAG);
  cacheLife("hours");
  if (!isSupabaseConfigured) return [];

  const { data, error } = await createPublicClient()
    .from("repair_cases")
    .select(CASE_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) {
    console.error("Could not load published repair cases:", error.message);
    return [];
  }
  return (data as unknown as CaseRow[]).map(toRepairCase);
}

/** One published case by its URL slug, or null. Cached. */
export async function getPublishedCase(slug: string): Promise<{ repairCase: RepairCase; rowId: string } | null> {
  "use cache";
  cacheTag(REPAIR_CASES_TAG);
  cacheLife("hours");
  if (!isSupabaseConfigured) return null;

  const { data } = await createPublicClient()
    .from("repair_cases")
    .select(CASE_SELECT)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  return data ? { repairCase: toRepairCase(data as unknown as CaseRow), rowId: (data as unknown as CaseRow).id } : null;
}

/** A case the given client may see (own case, or any case for staff). */
export async function getCaseRow(supabase: SupabaseClient, id: string): Promise<CaseRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await supabase.from("repair_cases").select(CASE_SELECT).eq("id", id).maybeSingle();
  return (data as unknown as CaseRow) ?? null;
}

export type MediaItem = RepairMedia & { approved: boolean; uploadedBy: string | null };

/**
 * Photos for a case, with short-lived signed URLs (the bucket is private).
 * Returns only what the client's user may see.
 */
export async function getCaseMedia(supabase: SupabaseClient, caseId: string): Promise<MediaItem[]> {
  const { data: rows } = await supabase
    .from("repair_media")
    .select("id, storage_path, caption, kind, approved, uploaded_by")
    .eq("repair_case_id", caseId)
    .order("created_at");
  if (!rows?.length) return [];

  const { data: signed } = await supabase.storage
    .from("repair-media")
    .createSignedUrls(rows.map((r) => r.storage_path), 60 * 60);
  const urlByPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  return rows
    .filter((r) => urlByPath.get(r.storage_path))
    .map((r) => ({
      id: r.id,
      url: urlByPath.get(r.storage_path)!,
      caption: r.caption,
      kind: r.kind,
      approved: r.approved,
      uploadedBy: r.uploaded_by,
    }));
}
