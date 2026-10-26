import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthFormFromUrl } from "@/components/auth/AuthFormFromUrl";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignupPage() {
  return (
    <>
      <h1 className="mb-1 text-xl font-semibold text-ink">Create your account</h1>
      <p className="mb-6 text-sm text-muted">
        Free. Your lesson progress and challenge scores will be saved to your account.
      </p>
      <Suspense fallback={<AuthForm mode="signup" />}>
        <AuthFormFromUrl mode="signup" />
      </Suspense>
    </>
  );
}
