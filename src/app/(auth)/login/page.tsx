import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthFormFromUrl } from "@/components/auth/AuthFormFromUrl";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-1 text-xl font-semibold text-ink">Sign in</h1>
      <p className="mb-6 text-sm text-muted">Save your progress and contribute repair cases.</p>
      <Suspense fallback={<AuthForm mode="login" />}>
        <AuthFormFromUrl mode="login" />
      </Suspense>
    </>
  );
}
