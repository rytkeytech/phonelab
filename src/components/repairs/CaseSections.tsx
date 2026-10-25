import { ExternalLink, ImageOff } from "lucide-react";
import type { RepairMeasurement, RepairMedia, RepairSource } from "@/lib/types";
import { measurementModeLabels } from "@/data/repairs";

/** A numbered section of a repair case, following the diagnostic workflow. */
export function CaseSection({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`case-step-${step}`} className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <h2 id={`case-step-${step}`} className="mb-3 flex items-center gap-2.5 text-base font-semibold text-ink">
        <span className="grid size-6 place-items-center rounded-md bg-accent-soft font-mono text-xs text-accent">{step}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Shown when a section has no content yet, so gaps are visible rather than hidden. */
export function Missing({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-faint italic">{children}</p>;
}

export function BulletList({ items, ordered = false }: { items: string[]; ordered?: boolean }) {
  const List = ordered ? "ol" : "ul";
  return (
    <List className={`space-y-1.5 pl-5 text-sm text-ink/85 marker:text-faint ${ordered ? "list-decimal" : "list-disc"}`}>
      {items.map((item) => (
        <li key={item} className="pl-1">
          {item}
        </li>
      ))}
    </List>
  );
}

const measurementFields: { key: keyof RepairMeasurement; label: string }[] = [
  { key: "point", label: "Point" },
  { key: "mode", label: "Mode" },
  { key: "condition", label: "Condition" },
  { key: "observed", label: "Observed" },
  { key: "reference", label: "Known-good reference" },
];

export function MeasurementList({ measurements }: { measurements: RepairMeasurement[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {measurements.map((m, i) => (
        <li key={i}>
          <dl className="grid gap-x-4 gap-y-2 rounded-lg border border-line bg-canvas p-3 text-sm sm:grid-cols-[150px_minmax(0,1fr)]">
            {measurementFields.map(({ key, label }) => (
              <div key={key} className="contents">
                <dt className="text-xs font-medium text-faint sm:pt-0.5">{label}</dt>
                <dd className={key === "observed" ? "font-medium text-ink" : "text-ink/85"}>
                  {key === "mode" ? measurementModeLabels[m.mode] : m[key]}
                </dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
  );
}

export function MediaGallery({ media }: { media: RepairMedia[] }) {
  if (media.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-line-strong p-4 text-sm text-faint">
        <ImageOff aria-hidden className="size-5 shrink-0" />
        No images attached. Board photos and thermal images will be uploaded with real submissions.
      </div>
    );
  }
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {media.map((item) => (
        <li key={item.id}>
          <figure className="overflow-hidden rounded-lg border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element -- user uploads from Supabase Storage */}
            <img src={item.url} alt={item.caption} className="aspect-video w-full object-cover" />
            <figcaption className="p-2 text-xs text-muted">{item.caption}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

const sourceKindLabel: Record<RepairSource["kind"], string> = {
  documentation: "Documentation",
  practical: "Practical evidence",
  forum: "Forum",
  video: "Video",
  other: "Other",
};

export function SourceList({ sources }: { sources: RepairSource[] }) {
  if (sources.length === 0) {
    return <Missing>No sources recorded. A case cannot be marked Verified or Corroborated without them.</Missing>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {sources.map((s) => (
        <li key={s.title} className="rounded-lg border border-line bg-canvas p-3 text-sm">
          <p className="flex flex-wrap items-center gap-2">
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                {s.title}
                <ExternalLink aria-hidden className="size-3.5" />
              </a>
            ) : (
              <span className="text-ink">{s.title}</span>
            )}
            <span className="text-xs text-faint">{sourceKindLabel[s.kind]}</span>
          </p>
          {s.note && <p className="mt-1 text-xs text-muted">{s.note}</p>}
        </li>
      ))}
    </ul>
  );
}
