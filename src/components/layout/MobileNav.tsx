"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { SidebarFooter } from "./Sidebar";

/** Top bar with a slide-out menu, shown below the lg breakpoint. */
export function MobileNav({ account }: { account: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // Close on Escape and stop the page behind the drawer from scrolling.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="grid size-10 place-items-center rounded-lg text-muted hover:bg-raised hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
        >
          <Menu aria-hidden className="size-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-canvas/70 backdrop-blur-sm"
          />
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-line bg-surface shadow-2xl"
          >
            <div className="flex h-14 items-center justify-between px-4">
              <Logo />
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-lg text-muted hover:bg-raised hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-2">
              <NavLinks onNavigate={() => setOpen(false)} />
            </nav>
            <SidebarFooter account={account} />
          </div>
        </div>
      )}
    </>
  );
}
