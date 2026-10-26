import { Suspense } from "react";
import { AccountPanel, AccountPanelSkeleton } from "@/components/account/AccountPanel";
import { ProgressSyncLoader } from "@/components/account/ProgressSyncLoader";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";

/** Shared shell for every page that shows the main navigation. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  // Reads the session, so it streams in behind Suspense while the page shell renders instantly.
  const account = (
    <Suspense fallback={<AccountPanelSkeleton />}>
      <AccountPanel />
    </Suspense>
  );

  return (
    <div className="flex min-h-dvh">
      <Sidebar account={account} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav account={account} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
      <Suspense fallback={null}>
        <ProgressSyncLoader />
      </Suspense>
    </div>
  );
}
