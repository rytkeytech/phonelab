import { getCurrentUser } from "@/lib/auth";
import { BookmarkSync } from "./BookmarkSync";
import { ProgressSync } from "./ProgressSync";

/** Starts progress and bookmark syncing for whoever is signed in. Render inside <Suspense>. */
export async function ProgressSyncLoader() {
  const user = await getCurrentUser();
  return (
    <>
      {user && <ProgressSync userId={user.id} />}
      <BookmarkSync userId={user?.id ?? null} />
    </>
  );
}
