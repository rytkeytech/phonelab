"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { inputClass } from "./fields";

const MAX_BYTES = 10 * 1024 * 1024; // matches the bucket limit
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/**
 * Uploads a board photo into the user's own folder of the private bucket,
 * then records it against the case (unapproved until a reviewer approves it).
 */
export function PhotoUploader({ caseId, userId }: { caseId: string; userId: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [kind, setKind] = useState("photo");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    const file = fileRef.current?.files?.[0];
    setError(null);
    if (!file) return setError("Choose a photo first.");
    if (!TYPES[file.type]) return setError("Use a JPG, PNG or WebP image.");
    if (file.size > MAX_BYTES) return setError("That image is larger than 10 MB.");

    setBusy(true);
    const supabase = createClient();
    const path = `${userId}/${caseId}/${crypto.randomUUID()}.${TYPES[file.type]}`;
    const stored = await supabase.storage.from("repair-media").upload(path, file, { contentType: file.type });
    if (stored.error) {
      setBusy(false);
      return setError(`Upload failed: ${stored.error.message}`);
    }
    const recorded = await supabase.from("repair_media").insert({
      repair_case_id: caseId,
      storage_path: path,
      caption: caption.trim().slice(0, 300),
      kind,
      uploaded_by: userId,
    });
    if (recorded.error) {
      await supabase.storage.from("repair-media").remove([path]);
      setBusy(false);
      return setError(`Couldn't attach the photo: ${recorded.error.message}`);
    }

    setBusy(false);
    setCaption("");
    if (fileRef.current) fileRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-dashed border-line-strong p-4">
      <p className="mb-3 text-sm font-medium text-ink">Add a photo</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_140px]">
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Image (JPG, PNG or WebP, up to 10 MB)</span>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-raised file:px-3 file:py-1.5 file:text-sm file:text-ink" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Caption</span>
          <input value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={300} placeholder="What it shows" className={`${inputClass} h-9 border-line`} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Type</span>
          <select value={kind} onChange={(e) => setKind(e.target.value)} className={`${inputClass} h-9 border-line`}>
            <option value="photo">Photo</option>
            <option value="thermal">Thermal image</option>
            <option value="diagram">Diagram</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-red-400">{error}</p>}
      <button
        type="button"
        onClick={upload}
        disabled={busy}
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-line-strong px-3 py-1.5 text-sm text-ink hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50"
      >
        {busy ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : <ImagePlus aria-hidden className="size-4" />}
        {busy ? "Uploading…" : "Upload photo"}
      </button>
      <p className="mt-2 text-xs text-faint">
        Photos stay private until a reviewer approves them. Only upload your own photos, and don&rsquo;t upload copyrighted schematics.
      </p>
    </div>
  );
}
