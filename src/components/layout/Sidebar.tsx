import { FlaskConical } from "lucide-react";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";

/** Desktop sidebar. Hidden below the lg breakpoint, where MobileNav takes over. */
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="px-5 py-5">
        <Logo />
      </div>
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3">
        <NavLinks />
      </nav>
      <SidebarFooter />
    </aside>
  );
}

export function SidebarFooter() {
  return (
    <div className="m-3 rounded-lg border border-line bg-raised p-3 text-xs leading-relaxed text-muted">
      <p className="mb-1 flex items-center gap-1.5 font-semibold text-caution">
        <FlaskConical aria-hidden className="size-3.5" />
        Preview build
      </p>
      Lesson progress is saved in this browser. Repairs and challenges show
      sample data until Supabase accounts are connected.
    </div>
  );
}
