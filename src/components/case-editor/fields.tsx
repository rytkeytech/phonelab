import { cx } from "@/lib/utils";

/* Small labelled inputs for the repair-case editor. Uncontrolled: values come from defaultValue. */

export const inputClass =
  "w-full rounded-lg border bg-canvas px-3 text-sm text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none";

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400">
      {error}
    </p>
  );
}

type Common = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
};

function Label({ name, label, hint, required }: Omit<Common, "error">) {
  return (
    <span className="mb-1.5 block">
      <span className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-red-400" aria-hidden> *</span>}
      </span>
      {hint && <span id={`${name}-hint`} className="mt-0.5 block text-xs text-faint">{hint}</span>}
    </span>
  );
}

const describedBy = (name: string, hint?: string, error?: string) =>
  [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(" ") || undefined;

export function TextField({
  defaultValue,
  maxLength,
  placeholder,
  ...c
}: Common & { defaultValue?: string; maxLength?: number; placeholder?: string }) {
  return (
    <label className="block" htmlFor={c.name}>
      <Label {...c} />
      <input
        id={c.name}
        name={c.name}
        defaultValue={defaultValue}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={Boolean(c.error)}
        aria-describedby={describedBy(c.name, c.hint, c.error)}
        className={cx(inputClass, "h-10", c.error ? "border-red-400/60" : "border-line")}
      />
      <FieldError id={c.name} error={c.error} />
    </label>
  );
}

export function TextArea({
  defaultValue,
  rows = 3,
  maxLength,
  placeholder,
  ...c
}: Common & { defaultValue?: string; rows?: number; maxLength?: number; placeholder?: string }) {
  return (
    <label className="block" htmlFor={c.name}>
      <Label {...c} />
      <textarea
        id={c.name}
        name={c.name}
        rows={rows}
        defaultValue={defaultValue}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={Boolean(c.error)}
        aria-describedby={describedBy(c.name, c.hint, c.error)}
        className={cx(inputClass, "py-2 leading-relaxed", c.error ? "border-red-400/60" : "border-line")}
      />
      <FieldError id={c.name} error={c.error} />
    </label>
  );
}

/** A textarea where each line is one list item. */
export function LinesField({ items, ...props }: Common & { items: string[]; rows?: number; placeholder?: string }) {
  return (
    <TextArea
      {...props}
      defaultValue={items.join("\n")}
      hint={props.hint ? `${props.hint} One per line.` : "One per line."}
    />
  );
}

export function SelectField({
  defaultValue,
  options,
  placeholder,
  ...c
}: Common & { defaultValue?: string; options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <label className="block" htmlFor={c.name}>
      <Label {...c} />
      <select
        id={c.name}
        name={c.name}
        defaultValue={defaultValue}
        aria-invalid={Boolean(c.error)}
        aria-describedby={describedBy(c.name, c.hint, c.error)}
        className={cx(inputClass, "h-10", c.error ? "border-red-400/60" : "border-line")}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError id={c.name} error={c.error} />
    </label>
  );
}

export function Fieldset({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <legend className="sr-only">{title}</legend>
      <h2 aria-hidden className="text-base font-semibold text-ink">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </fieldset>
  );
}
