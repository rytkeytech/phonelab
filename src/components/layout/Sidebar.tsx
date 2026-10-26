import { FlaskConical } from "lucide-react";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";

/** Desktop sidebar. Hidden below the lg breakpoint, where MobileNav takes over. */
export function Sidebar({ account }: { account: React.ReactNode }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="px-5 py-5">
        <Logo />
      </div>
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3">
        <NavLinks />
      </nav>
      <SidebarFooter account={account} />
    </aside>
  );
}

/** Account box plus a note about sample content; shared with the mobile menu. */
export function SidebarFooter({ account }: { account: React.ReactNode }) {
  return (
    <div className="m-3 flex flex-col gap-2">
      {account}
      <p className="flex items-start gap-1.5 px-1 text-[11px] leading-relaxed text-faint">
        <FlaskConical aria-hidden className="mt-0.5 size-3 shrink-0 text-caution" />
        Repair cases are samples until reviewed submissions are published.
      </p>
    </div>
  );
}
