"use client";

import { useSearchParams } from "next/navigation";
import { safeNextPath } from "@/lib/safe-path";
import { AuthForm } from "./AuthForm";

/** Reads ?next= and ?error= (from email links) and passes them to the form. */
export function AuthFormFromUrl({ mode }: { mode: "login" | "signup" }) {
  const params = useSearchParams();
  return <AuthForm mode={mode} next={safeNextPath(params.get("next"))} linkError={params.get("error") ?? undefined} />;
}
