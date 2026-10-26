"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { RepairMeasurement, RepairSource } from "@/lib/types";
import { measurementModeLabels } from "@/data/repairs/taxonomy";
import { cx } from "@/lib/utils";
import { FieldError, inputClass } from "./fields";

/*
 * Editors for repeatable rows. They keep rows in state and submit them as
 * JSON in a hidden input, which the server action parses and validates.
 */

type FieldSpec<T> = {
  key: keyof T;
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  wide?: boolean;
};

function RowsEditor<T extends object>({
  name,
  label,
  hint,
  error,
  initial,
  empty,
  fields,
  addLabel,
}: {
  name: string;
  label: string;
  hint: string;
  error?: string;
  initial: T[];
  empty: T;
  fields: FieldSpec<T>[];
  addLabel: string;
}) {
  const [rows, setRows] = useState<T[]>(initial);
  const update = (i: number, key: keyof T, value: string) =>
    setRows((r) => r.map((row, j) => (j === i ? { ...row, [key]: value } : row)));

  return (
    <div role="group" aria-labelledby={`${name}-label`} aria-describedby={`${name}-hint${error ? ` ${name}-error` : ""}`}>
      {/* The surrounding section already shows this title; keep it for screen readers. */}
      <p id={`${name}-label`} className="sr-only">{label}</p>
      <p id={`${name}-hint`} className="mb-3 text-xs text-faint">{hint}</p>
      <input type="hidden" name={name} value={JSON.stringify(rows)} />

      {rows.length === 0 && <p className="mb-3 text-sm text-faint italic">None added yet.</p>}
      <ol className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <li key={i} className="rounded-lg border border-line bg-canvas p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs text-faint">#{i + 1}</span>
              <button
                type="button"
                onClick={() => setRows((r) => r.filter((_, j) => j !== i))}
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted hover:text-red-400 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <Trash2 aria-hidden className="size-3.5" />
                Remove
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {fields.map((f) => {
                const id = `${name}-${i}-${String(f.key)}`;
                const value = String((row[f.key] as string | undefined) ?? "");
                return (
                  <label key={id} htmlFor={id} className={cx("block", f.wide && "sm:col-span-2")}>
                    <span className="mb-1 block text-xs text-muted">{f.label}</span>
                    {f.options ? (
                      <select id={id} value={value} onChange={(e) => update(i, f.key, e.target.value)} className={cx(inputClass, "h-9 border-line")}>
                        {f.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={id}
                        value={value}
                        placeholder={f.placeholder}
                        maxLength={500}
                        onChange={(e) => update(i, f.key, e.target.value)}
                        className={cx(inputClass, "h-9 border-line")}
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => setRows((r) => [...r, { ...empty }])}
        disabled={rows.length >= 30}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-1.5 text-sm text-ink hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-40"
      >
        <Plus aria-hidden className="size-4" />
        {addLabel}
      </button>
      <FieldError id={name} error={error} />
    </div>
  );
}

const modeOptions = Object.entries(measurementModeLabels).map(([value, label]) => ({ value, label }));

export function MeasurementsEditor({ initial, error }: { initial: RepairMeasurement[]; error?: string }) {
  return (
    <RowsEditor<RepairMeasurement>
      name="measurements"
      label="Measurements"
      hint="Record where, how and in what board state each reading was taken, and what a known-good board showed. Write values exactly as measured on this board; never copy them from another model."
      error={error}
      initial={initial}
      empty={{ point: "", mode: "diode", condition: "", observed: "", reference: "" }}
      addLabel="Add measurement"
      fields={[
        { key: "point", label: "Point (from schematic/boardview)", placeholder: "e.g. C1234 on main supply line", wide: true },
        { key: "mode", label: "Mode", options: modeOptions },
        { key: "condition", label: "Board condition", placeholder: "e.g. battery disconnected" },
        { key: "observed", label: "Observed", placeholder: "What the meter showed" },
        { key: "reference", label: "Known-good reference", placeholder: "Same point on a good board, or 'none'" },
      ]}
    />
  );
}

const sourceKindOptions = [
  { value: "documentation", label: "Documentation" },
  { value: "practical", label: "Practical evidence" },
  { value: "forum", label: "Forum" },
  { value: "video", label: "Video" },
  { value: "other", label: "Other" },
];

export function SourcesEditor({ initial, error }: { initial: RepairSource[]; error?: string }) {
  return (
    <RowsEditor<RepairSource>
      name="sources"
      label="Sources"
      hint="Where the information comes from: service documentation, your own repeatable bench evidence, or other references. Don't paste copyrighted schematics; link or describe them."
      error={error}
      initial={initial}
      empty={{ title: "", url: "", kind: "practical", note: "" }}
      addLabel="Add source"
      fields={[
        { key: "title", label: "Title", placeholder: "e.g. Bench test on two boards", wide: true },
        { key: "kind", label: "Type", options: sourceKindOptions },
        { key: "url", label: "Link (optional)", placeholder: "https://…" },
        { key: "note", label: "Note (optional)", placeholder: "What it supports", wide: true },
      ]}
    />
  );
}
