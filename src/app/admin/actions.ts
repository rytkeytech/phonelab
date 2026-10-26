"use server";

import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { readCaseForm, validateCase } from "@/lib/case-form";
import { caseColumns, ensurePhoneModel, hasErrors, type CaseFormState } from "@/lib/case-save";
import { REPAIR_CASES_TAG } from "@/lib/repair-cases";
import { createClient } from "@/lib/supabase/server";
import { faultCategories } from "@/data/repairs/taxonomy";
import type { ConfidenceLevel } from "@/lib/types";

const faultCategoryIds = faultCategories.map((c) => c.id);
const allConfidence: ConfidenceLevel[] = ["verified", "corroborated", "hypothesis", "unverified"];

type Decision = "save" | "publish" | "request_changes" | "reject" | "unpublish";
const decisions: Decision[] = ["save", "publish", "request_changes", "reject", "unpublish"];

const doneMessage: Record<Decision, string> = {
  save: "saved",
  publish: "published",
  request_changes: "changes-requested",
  reject: "rejected",
  unpublish: "unpublished",
};

/** A reviewer edits a case and records a decision. */
export async function reviewCase(prev: CaseFormState, formData: FormData): Promise<CaseFormState> {
  const draft = readCaseForm(formData);
  const fail = (state: CaseFormState): CaseFormState => ({ ...state, values: draft, attempt: (prev.attempt ?? 0) + 1 });

  const user = await getCurrentUser();
  if (!isStaff(user)) return fail({ message: "Only reviewers and admins can do this." });

  const decision = decisions.find((d) => d === formData.get("decision")) ?? "save";
  const notes = String(formData.get("reviewNotes") ?? "").trim().slice(0, 2000);
  if (!draft.id) return fail({ message: "Missing case id." });

  const level = decision === "publish" ? "publish" : "draft";
  const errors = validateCase(draft, level, { faultCategoryIds, allowedConfidence: allConfidence });
  if ((decision === "request_changes" || decision === "reject") && !notes) {
    errors.form = "Add a note for the submitter explaining what to change or why it was rejected.";
  }
  if (hasErrors(errors)) return fail({ errors, message: errors.form ?? "Please fix the highlighted fields." });

  const supabase = await createClient();
  const now = new Date().toISOString();
  const statusFields =
    decision === "publish"
      ? { status: "published", reviewed_by: user!.id, reviewed_at: now, published_at: now, review_notes: notes || null }
      : decision === "request_changes"
        ? { status: "changes_requested", review_notes: notes }
        : decision === "reject"
          ? { status: "rejected", reviewed_by: user!.id, reviewed_at: now, published_at: null, review_notes: notes }
          : decision === "unpublish"
            ? { status: "submitted", published_at: null, review_notes: notes || null }
            : notes
              ? { review_notes: notes }
              : {};

  try {
    const columns = caseColumns(draft, await ensurePhoneModel(supabase, draft));
    const { data, error } = await supabase
      .from("repair_cases")
      .update({ ...columns, ...statusFields })
      .eq("id", draft.id)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (!data) return fail({ message: "Case not found." });
  } catch (error) {
    return fail({ message: `Couldn't save: ${(error as Error).message}` });
  }

  // Published content may have changed: refresh the public repository.
  updateTag(REPAIR_CASES_TAG);
  redirect(decision === "save" ? `/admin/cases/${draft.id}?saved=1` : `/admin?done=${doneMessage[decision]}`);
}

/** Approves or hides a photo. Approved photos of published cases are public. */
export async function setMediaApproval(formData: FormData) {
  const user = await getCurrentUser();
  if (!isStaff(user)) return;
  const supabase = await createClient();
  await supabase
    .from("repair_media")
    .update({ approved: formData.get("approved") === "true" })
    .eq("id", String(formData.get("mediaId")));
  updateTag(REPAIR_CASES_TAG);
  refresh();
}
