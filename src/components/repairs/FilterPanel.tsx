import type { ConfidenceLevel, RepairCase } from "@/lib/types";
import { cx } from "@/lib/utils";
import { faultCategories, platformNames } from "@/data/repairs";
import type { RepairFilters } from "@/data/repairs/search";
import { confidenceInfo } from "@/components/ui/ConfidenceBadge";
import { Select } from "@/components/ui/Select";

const confidenceLevels = Object.keys(confidenceInfo) as ConfidenceLevel[];

function count<T>(items: T[], pick: (item: T) => string) {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(pick(item), (counts.get(pick(item)) ?? 0) + 1);
  return counts;
}

export function FilterPanel({
  cases,
  filters,
  onChange,
}: {
  cases: RepairCase[];
  filters: RepairFilters;
  onChange: (patch: Partial<RepairFilters>) => void;
}) {
  const brands = [...count(cases, (c) => c.brand)].sort(([a], [b]) => a.localeCompare(b));
  const models = [...count(cases.filter((c) => !filters.brand || c.brand === filters.brand), (c) => c.model)].sort(
    ([a], [b]) => a.localeCompare(b),
  );
  const platforms = count(cases, (c) => c.platform);
  const categories = count(cases, (c) => c.faultCategory);
  const confidences = count(cases, (c) => c.confidence);

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Manufacturer"
        value={filters.brand}
        // Changing brand clears a model that may not belong to it
        onChange={(brand) => onChange({ brand, model: "" })}
        placeholder="All manufacturers"
        options={brands.map(([b, n]) => ({ value: b, label: `${b} (${n})` }))}
      />
      <Select
        label="Phone model"
        value={filters.model}
        onChange={(model) => onChange({ model })}
        placeholder="All models"
        options={models.map(([m, n]) => ({ value: m, label: `${m} (${n})` }))}
      />
      <Select
        label="Chipset platform"
        value={filters.platform}
        onChange={(platform) => onChange({ platform })}
        placeholder="All platforms"
        options={Object.entries(platformNames).map(([value, label]) => {
          const n = platforms.get(value) ?? 0;
          return { value, label: `${label} (${n})`, disabled: n === 0 };
        })}
      />
      <Select
        label="Fault category"
        value={filters.category}
        onChange={(category) => onChange({ category })}
        placeholder="All categories"
        options={faultCategories.map(({ id, label }) => {
          const n = categories.get(id) ?? 0;
          return { value: id, label: `${label} (${n})`, disabled: n === 0 };
        })}
      />

      <fieldset>
        <legend className="mb-1.5 text-xs font-medium text-muted">Verification status</legend>
        <div className="flex flex-col gap-1.5">
          {confidenceLevels.map((level) => {
            const on = filters.confidence.includes(level);
            const n = confidences.get(level) ?? 0;
            return (
              <label
                key={level}
                className={cx(
                  "flex cursor-pointer items-center gap-2.5 rounded-md border px-2.5 py-1.5 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-accent",
                  on ? "border-line-strong bg-raised text-ink" : "border-transparent text-muted hover:text-ink",
                )}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() =>
                    onChange({
                      confidence: on ? filters.confidence.filter((c) => c !== level) : [...filters.confidence, level],
                    })
                  }
                  className="accent-[var(--color-accent)]"
                />
                <span className={cx("size-2 rounded-full bg-current", confidenceInfo[level].className.split(" ")[0])} aria-hidden />
                <span className="flex-1">{confidenceInfo[level].label}</span>
                <span className="font-mono text-xs text-faint">{n}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
