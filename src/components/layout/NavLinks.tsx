"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/utils";
import { navItems } from "./nav-items";

type Props = { onNavigate?: () => void };

function isActive(pathname: string | null, href: string) {
  if (pathname === null) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * Main navigation. On pages whose URL is only known at request time (e.g.
 * /admin/cases/[id]) the links render first without the "current page"
 * highlight, which appears once the URL is known.
 */
export function NavLinks(props: Props) {
  return (
    <Suspense fallback={<NavList {...props} pathname={null} />}>
      <CurrentNavList {...props} />
    </Suspense>
  );
}

function CurrentNavList(props: Props) {
  return <NavList {...props} pathname={usePathname()} />;
}

function NavList({ onNavigate, pathname }: Props & { pathname: string | null }) {
  return (
    <ul className="flex flex-col gap-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cx(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-accent",
                active
                  ? "bg-accent-soft text-ink"
                  : "text-muted hover:bg-raised hover:text-ink",
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent"
                />
              )}
              <Icon
                aria-hidden
                className={cx(
                  "size-4 shrink-0",
                  active ? "text-accent" : "text-faint group-hover:text-muted",
                )}
              />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
