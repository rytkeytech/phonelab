import { ChevronDown } from "lucide-react";

export type SelectOption = { value: string; label: string; disabled?: boolean };

/** Labelled native select (native keeps it accessible and mobile-friendly). */
export function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Label for the empty "any" option */
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="h-10 w-full appearance-none rounded-lg border border-line bg-canvas pr-9 pl-3 text-sm text-ink focus:border-accent/60 focus:outline-none disabled:cursor-not-allowed disabled:text-faint"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-faint" />
      </span>
    </label>
  );
}
