"use client";

import { useActionState } from "react";
import { CircleAlert, LoaderCircle } from "lucide-react";
import type { ConfidenceLevel } from "@/lib/types";
import type { CaseDraft } from "@/lib/case-form";
import type { CaseFormState } from "@/lib/case-save";
import type { CaseStatus } from "@/lib/repair-cases";
import { faultCategories, platformNames } from "@/data/repairs/taxonomy";
import { confidenceInfo } from "@/components/ui/ConfidenceBadge";
import { Fieldset, LinesField, SelectField, TextArea, TextField } from "./fields";
import { MeasurementsEditor, SourcesEditor } from "./RowsEditor";

type Props = {
  initial: CaseDraft;
  action: (state: CaseFormState, formData: FormData) => Promise<CaseFormState>;
  /** "member" submits for review; "reviewer" edits and decides */
  mode: "member" | "reviewer";
  allowedConfidence: ConfidenceLevel[];
  /** Explorer blocks that can be linked to the case */
  blocks: { id: string; label: string }[];
  status?: CaseStatus;
  reviewNotes?: string | null;
};

const buttonBase =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50";
const primary = `${buttonBase} bg-accent text-canvas hover:bg-accent-strong`;
const secondary = `${buttonBase} border border-line-strong text-ink hover:bg-raised`;
const danger = `${buttonBase} border border-red-400/40 text-red-400 hover:bg-red-400/10`;

export function CaseForm({ initial, action, mode, allowedConfidence, blocks, status, reviewNotes }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const values = state.values ?? initial;
  const e = state.errors ?? {};

  return (
    // key: after a failed save React clears the form, so remount it with the submitted values.
    <form key={state.attempt ?? 0} action={formAction} className="flex flex-col gap-4" noValidate>
      {values.id && <input type="hidden" name="id" value={values.id} />}

      {state.message && (
        <p role="alert" className="flex gap-2 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-ink">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-red-400" />
          {state.message}
        </p>
      )}

      <Fieldset title="Device" description="Record the exact model. Board revision matters: designs can change between revisions.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="brand" label="Manufacturer" required defaultValue={values.brand} maxLength={60} placeholder="e.g. Samsung" error={e.brand} />
          <TextField name="model" label="Exact model" required defaultValue={values.model} maxLength={100} placeholder="e.g. Galaxy A12 (SM-A125F)" error={e.model} />
          <SelectField
            name="platform"
            label="Chipset platform"
            required
            defaultValue={values.platform}
            placeholder="Choose…"
            options={Object.entries(platformNames).map(([value, label]) => ({ value, label }))}
            error={e.platform}
          />
          <TextField name="chipset" label="Chipset (if known)" defaultValue={values.chipset} maxLength={80} placeholder="e.g. Helio P35" error={e.chipset} />
          <TextField name="boardRevision" label="Board revision (if known)" defaultValue={values.boardRevision} maxLength={60} error={e.boardRevision} />
        </div>
      </Fieldset>

      <Fieldset title="The fault">
        <TextField name="title" label="Title" required defaultValue={values.title} maxLength={160} placeholder="e.g. No power after liquid exposure, short on main supply line" error={e.title} />
        <TextArea name="summary" label="Summary" required defaultValue={values.summary} maxLength={500} rows={2} hint="Two or three sentences: what was wrong and what fixed it." error={e.summary} />
        <SelectField
          name="faultCategory"
          label="Fault category"
          required
          defaultValue={values.faultCategory}
          placeholder="Choose…"
          options={faultCategories.map((c) => ({ value: c.id, label: c.label }))}
          error={e.faultCategory}
        />
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-ink">Related Chipset Explorer blocks</legend>
          <div className="flex flex-wrap gap-2">
            {blocks.map((b) => (
              <label key={b.id} className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line px-2.5 py-1 text-sm text-muted has-checked:border-accent/50 has-checked:text-ink">
                <input type="checkbox" name="relatedBlocks" value={b.id} defaultChecked={values.relatedBlocks.includes(b.id)} className="accent-[var(--color-accent)]" />
                {b.label}
              </label>
            ))}
          </div>
        </fieldset>
      </Fieldset>

      <Fieldset title="Symptoms and first checks">
        <LinesField name="symptoms" label="Symptoms" required items={values.symptoms} rows={3} error={e.symptoms} />
        <LinesField name="initialChecks" label="Initial checks" items={values.initialChecks} rows={3} hint="Cheap checks done first, and their results." error={e.initialChecks} />
      </Fieldset>

      <Fieldset title="Measurements">
        <MeasurementsEditor initial={values.measurements} error={e.measurements} />
      </Fieldset>

      <Fieldset title="Diagnosis and repair">
        <LinesField name="diagnosticSteps" label="Diagnostic steps" required items={values.diagnosticSteps} rows={4} hint="In the order you did them." error={e.diagnosticSteps} />
        <TextArea name="rootCause" label="Root cause" defaultValue={values.rootCause} rows={2} maxLength={1000} hint="Leave empty if it hasn't been determined." error={e.rootCause} />
        <LinesField name="repairProcedure" label="Repair procedure" items={values.repairProcedure} rows={3} error={e.repairProcedure} />
        <LinesField name="verification" label="Final verification" items={values.verification} rows={3} hint="Tests that prove the repair worked." error={e.verification} />
      </Fieldset>

      <Fieldset title="Sources">
        <SourcesEditor initial={values.sources} error={e.sources} />
      </Fieldset>

      <Fieldset
        title="Confidence"
        description={
          mode === "member"
            ? "Members can mark a case Hypothesis or Unverified. A reviewer decides whether it's Corroborated or Verified."
            : "Verified needs at least one source; Corroborated needs at least two."
        }
      >
        <SelectField
          name="confidence"
          label="Confidence level"
          defaultValue={values.confidence}
          options={allowedConfidence.map((c) => ({ value: c, label: `${confidenceInfo[c].label}: ${confidenceInfo[c].description}` }))}
          error={e.confidence}
        />
        <TextArea name="confidenceNote" label="Why this level?" defaultValue={values.confidenceNote} rows={2} maxLength={500} error={e.confidenceNote} />
      </Fieldset>

      {mode === "member" ? (
        <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center justify-end gap-3 rounded-xl border border-line bg-surface/95 p-3 backdrop-blur">
          {pending && <LoaderCircle aria-label="Saving" className="size-4 animate-spin text-muted" />}
          <button type="submit" name="intent" value="draft" disabled={pending} className={secondary}>
            Save draft
          </button>
          <button type="submit" name="intent" value="submit" disabled={pending} className={primary}>
            Submit for review
          </button>
        </div>
      ) : (
        <div className="sticky bottom-0 z-10 -mx-1 flex flex-col gap-3 rounded-xl border border-line bg-surface/95 p-3 backdrop-blur">
          <TextArea
            name="reviewNotes"
            label="Note to the submitter"
            defaultValue={reviewNotes ?? ""}
            rows={2}
            maxLength={2000}
            hint="Required when requesting changes or rejecting."
            error={e.form}
          />
          <div className="flex flex-wrap items-center justify-end gap-2">
            {pending && <LoaderCircle aria-label="Saving" className="size-4 animate-spin text-muted" />}
            <button type="submit" name="decision" value="save" disabled={pending} className={secondary}>
              Save changes
            </button>
            {status !== "rejected" && (
              <button type="submit" name="decision" value="reject" disabled={pending} className={danger}>
                Reject
              </button>
            )}
            {status !== "published" && (
              <button type="submit" name="decision" value="request_changes" disabled={pending} className={secondary}>
                Request changes
              </button>
            )}
            {status === "published" ? (
              <button type="submit" name="decision" value="unpublish" disabled={pending} className={secondary}>
                Unpublish
              </button>
            ) : (
              <button type="submit" name="decision" value="publish" disabled={pending} className={primary}>
                Publish
              </button>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
