import { connection } from "next/server";
import { getCaseMedia } from "@/lib/repair-cases";
import { createPublicClient } from "@/lib/supabase/public";
import { MediaGallery } from "./CaseSections";

/**
 * Approved photos of a published case. Signed URLs expire, so this renders
 * per request (behind Suspense) instead of being cached with the page.
 */
export async function PublicCaseMedia({ caseRowId }: { caseRowId: string }) {
  await connection();
  const media = await getCaseMedia(createPublicClient(), caseRowId);
  return <MediaGallery media={media.filter((m) => m.approved)} />;
}
