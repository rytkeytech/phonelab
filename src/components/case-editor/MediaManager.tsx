import { Check, EyeOff, ImageOff, Trash2 } from "lucide-react";
import type { MediaItem } from "@/lib/repair-cases";
import { deleteMedia } from "@/app/repairs/actions";
import { setMediaApproval } from "@/app/admin/actions";
import { Badge } from "@/components/ui/Badge";

/**
 * Photos attached to a case, for the owner or a reviewer.
 * Owners can delete unapproved photos; reviewers can approve, hide or delete any.
 */
export function MediaManager({ media, viewer }: { media: MediaItem[]; viewer: "owner" | "reviewer" }) {
  if (media.length === 0) {
    return (
      <p className="flex items-center gap-2 text-sm text-faint">
        <ImageOff aria-hidden className="size-4" />
        No photos yet.
      </p>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {media.map((m) => (
        <li key={m.id} className="overflow-hidden rounded-lg border border-line bg-canvas">
          {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed URLs from private storage */}
          <img src={m.url} alt={m.caption || "Repair photo"} className="aspect-video w-full object-cover" />
          <div className="flex flex-col gap-2 p-3">
            <div className="flex flex-wrap items-center gap-2">
              {m.approved ? <Badge tone="accent">Approved</Badge> : <Badge>Awaiting approval</Badge>}
              <span className="text-xs text-faint capitalize">{m.kind}</span>
            </div>
            {m.caption && <p className="text-sm text-ink/85">{m.caption}</p>}
            <div className="flex flex-wrap gap-2">
              {viewer === "reviewer" && (
                <form action={setMediaApproval}>
                  <input type="hidden" name="mediaId" value={m.id} />
                  <input type="hidden" name="approved" value={String(!m.approved)} />
                  <button type="submit" className="inline-flex items-center gap-1 rounded-md border border-line-strong px-2 py-1 text-xs text-ink hover:bg-raised">
                    {m.approved ? <EyeOff aria-hidden className="size-3.5" /> : <Check aria-hidden className="size-3.5" />}
                    {m.approved ? "Hide" : "Approve"}
                  </button>
                </form>
              )}
              {(viewer === "reviewer" || !m.approved) && (
                <form action={deleteMedia}>
                  <input type="hidden" name="mediaId" value={m.id} />
                  <button type="submit" className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-xs text-muted hover:text-red-400">
                    <Trash2 aria-hidden className="size-3.5" />
                    Delete
                  </button>
                </form>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
