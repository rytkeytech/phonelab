import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

/** Minimal layout for sign-in and sign-up: no sidebar, centred card. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="mb-8">
        <Logo />
      </div>
      <main className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 sm:p-8">{children}</main>
      <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" />
        Back to PhoneLab
      </Link>
    </div>
  );
}
