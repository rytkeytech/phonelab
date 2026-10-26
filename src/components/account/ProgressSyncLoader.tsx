import { getCurrentUser } from "@/lib/auth";
import { ProgressSync } from "./ProgressSync";

/** Starts progress syncing when someone is signed in. Render inside <Suspense>. */
export async function ProgressSyncLoader() {
  const user = await getCurrentUser();
  return user ? <ProgressSync userId={user.id} /> : null;
}
