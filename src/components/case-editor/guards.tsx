import Link from "next/link";
import { LockKeyhole } from "lucide-react";

/** Shown when a signed-in user opens a page they aren't allowed to use. */
export function NoAccess({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line-strong px-6 py-12 text-center">
      <LockKeyhole aria-hidden className="mb-3 size-8 text-faint" />
      <p className="font-medium text-ink">{message}</p>
      <Link href="/" className="mt-4 text-sm text-accent hover:underline">
        Back to the dashboard
      </Link>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-48 animate-pulse rounded-xl border border-line bg-surface" />
      ))}
    </div>
  );
}
