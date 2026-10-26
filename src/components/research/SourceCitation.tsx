import { ExternalLink, FileSearch } from "lucide-react";
import type { EvidenceType, ResearchClaim } from "@/lib/types";
import { getClaim } from "@/data/research/claims";
import { getSource } from "@/data/research/sources";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { cx } from "@/lib/utils";

export const evidenceLabel: Record<EvidenceType, string> = {
  "direct-source": "Direct source",
  corroborated: "Corroborated",
  "engineering-inference": "Engineering inference",
  "general-principle": "General principle",
};

/**
 * The evidence behind a piece of content: each claim's confidence, what its
 * sources establish, and their limits. Collapsed by default; plain <details>,
 * so it works without JavaScript.
 */
export function SourceCitation({ claimIds, className }: { claimIds?: string[]; className?: string }) {
  const claims = (claimIds ?? []).map(getClaim).filter((c): c is ResearchClaim => Boolean(c));
  if (claims.length === 0) return null;

  return (
    <details className={cx("group rounded-lg border border-line bg-surface/60 text-xs", className)}>
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2 px-3 py-2 text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
        <FileSearch aria-hidden className="size-3.5" />
        <span className="font-medium">Evidence</span>
        {claims.map((c) => (
          <ConfidenceBadge key={c.id} level={c.confidence} />
        ))}
        <span className="ml-auto text-faint group-open:hidden">Show</span>
        <span className="ml-auto hidden text-faint group-open:inline">Hide</span>
      </summary>
      <ul className="flex flex-col gap-3 border-t border-line px-3 py-3">
        {claims.map((c) => (
          <ClaimDetail key={c.id} claim={c} />
        ))}
      </ul>
    </details>
  );
}

function ClaimDetail({ claim: c }: { claim: ResearchClaim }) {
  return (
    <li className="flex flex-col gap-1.5">
      <p className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-faint">{c.id}</span>
        <ConfidenceBadge level={c.confidence} />
        <span className="text-muted">{evidenceLabel[c.evidence]}</span>
      </p>
      <p className="text-ink/90">{c.statement}</p>
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-muted">
        <dt className="text-faint">Applies to</dt>
        <dd>{c.appliesTo}</dd>
        <dt className="text-faint">Established</dt>
        <dd>{c.establishes}</dd>
        <dt className="text-faint">Limits</dt>
        <dd>{c.limitations}</dd>
        <dt className="text-faint">Sources</dt>
        <dd>
          {c.sources.length === 0 ? (
            <span className="italic">No source read yet{c.questionId ? ` (open question ${c.questionId})` : ""}.</span>
          ) : (
            <ul className="flex flex-col gap-1">
              {c.sources.map(({ sourceId, locator }) => {
                const s = getSource(sourceId);
                if (!s) return null;
                const isUrl = s.location.startsWith("http");
                return (
                  <li key={sourceId}>
                    {isUrl ? (
                      <a href={s.location} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                        {s.title}
                        <ExternalLink aria-hidden className="size-3" />
                      </a>
                    ) : (
                      <span className="text-ink/90">{s.title} ({s.location})</span>
                    )}
                    <span className="text-faint">, {s.publisher}, {locator}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </dd>
        <dt className="text-faint">Researched</dt>
        <dd>{c.researched}</dd>
      </dl>
    </li>
  );
}
