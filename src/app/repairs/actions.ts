"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { MEMBER_CONFIDENCE, makeSlug, readCaseForm, validateCase } from "@/lib/case-form";
import { caseColumns, ensurePhoneModel, hasErrors, type CaseFormState } from "@/lib/case-save";
import { REPAIR_CASES_TAG } from "@/lib/repair-cases";
import { createClient } from "@/lib/supabase/server";
import { faultCategories } from "@/data/repairs/taxonomy";

const faultCategoryIds = faultCategories.map((c) => c.id);

/** A member creates or edits their own case, as a draft or submitted for review. */
export async function saveOwnCase(prev: CaseFormState, formData: FormData): Promise<CaseFormState> {
  const draft = readCaseForm(formData);
  const fail = (state: CaseFormState): CaseFormState => ({ ...state, values: draft, attempt: (prev.attempt ?? 0) + 1 });

  const user = await getCurrentUser();
  if (!user) return fail({ message: "Your session has ended. Please sign in again." });

  const intent = formData.get("intent") === "submit" ? "submit" : "draft";
  const errors = validateCase(draft, intent, { faultCategoryIds, allowedConfidence: MEMBER_CONFIDENCE });
  if (hasErrors(errors)) return fail({ errors, message: "Please fix the highlighted fields." });

  const supabase = await createClient();
  let caseId = draft.id;
  try {
    const columns = { ...caseColumns(draft, await ensurePhoneModel(supabase, draft)), status: intent === "submit" ? "submitted" : "draft" };
    if (caseId) {
      // RLS only allows this while the case is a draft, submitted, or has changes requested.
      const { data, error } = await supabase.from("repair_cases").update(columns).eq("id", caseId).select("id").maybeSingle();
      if (error) throw error;
      if (!data) return fail({ message: "This case can't be edited right now. It may have been published or rejected." });
    } else {
      const { data, error } = await supabase
        .from("repair_cases")
        .insert({ ...columns, slug: makeSlug(draft, randomBytes(2).toString("hex")), submitted_by: user.id })
        .select("id")
        .single();
      if (error) throw error;
      caseId = data.id;
    }
  } catch (error) {
    return fail({ message: `Couldn't save the case: ${(error as Error).message}` });
  }

  redirect(`/repairs/mine/${caseId}?saved=${intent}`);
}

/** Deletes a photo. Members may delete their own unapproved photos; staff any. */
export async function deleteMedia(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const supabase = await createClient();
  const { data: media } = await supabase
    .from("repair_media")
    .select("id, storage_path, approved")
    .eq("id", String(formData.get("mediaId")))
    .maybeSingle();
  if (!media) return;

  const { error } = await supabase.from("repair_media").delete().eq("id", media.id);
  if (!error) await supabase.storage.from("repair-media").remove([media.storage_path]);
  if (media.approved && isStaff(user)) updateTag(REPAIR_CASES_TAG);
  refresh();
}
