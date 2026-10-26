import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CaseDraft, FieldErrors } from "./case-form";

/*
 * Database writes shared by the member and reviewer actions.
 */

export type CaseFormState = {
  errors?: FieldErrors;
  message?: string;
  /** What was submitted, so the form can refill itself after an error */
  values?: CaseDraft;
  /** Changes on every failed submission so the form remounts with `values` */
  attempt?: number;
};

/** Finds the brand and model (case-insensitively) or creates them. Returns the model id. */
export async function ensurePhoneModel(supabase: SupabaseClient, d: CaseDraft): Promise<string> {
  let { data: brand } = await supabase.from("brands").select("id").ilike("name", d.brand).maybeSingle();
  if (!brand) {
    const inserted = await supabase.from("brands").insert({ name: d.brand }).select("id").single();
    if (inserted.error) throw new Error(`Couldn't save the manufacturer: ${inserted.error.message}`);
    brand = inserted.data;
  }

  const { data: model } = await supabase
    .from("phone_models")
    .select("id")
    .eq("brand_id", brand.id)
    .ilike("name", d.model)
    .maybeSingle();
  if (model) return model.id;

  const inserted = await supabase
    .from("phone_models")
    .insert({ brand_id: brand.id, name: d.model, platform: d.platform, chipset: d.chipset || null })
    .select("id")
    .single();
  if (inserted.error) throw new Error(`Couldn't save the phone model: ${inserted.error.message}`);
  return inserted.data.id;
}

/** The case's content columns (not status or review fields). */
export function caseColumns(d: CaseDraft, phoneModelId: string) {
  return {
    title: d.title,
    summary: d.summary,
    phone_model_id: phoneModelId,
    board_revision: d.boardRevision || null,
    fault_category_id: d.faultCategory,
    symptoms: d.symptoms,
    initial_checks: d.initialChecks,
    measurements: d.measurements,
    diagnostic_steps: d.diagnosticSteps,
    root_cause: d.rootCause || null,
    repair_procedure: d.repairProcedure,
    verification: d.verification,
    sources: d.sources,
    confidence: d.confidence,
    confidence_note: d.confidenceNote,
    related_blocks: d.relatedBlocks,
  };
}

export const hasErrors = (errors: FieldErrors) => Object.keys(errors).length > 0;
