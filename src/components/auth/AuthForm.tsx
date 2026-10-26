"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CircleAlert, LoaderCircle, MailCheck } from "lucide-react";
import { signIn, signUp, type AuthFormState } from "@/app/auth/actions";

const initialState: AuthFormState = { status: "idle" };

const inputClass =
  "h-11 w-full rounded-lg border border-line bg-canvas px-3 text-sm text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none";

export function AuthForm({
  mode,
  next = "/",
  linkError,
}: {
  mode: "login" | "signup";
  /** Where to go after signing in */
  next?: string;
  /** Error passed back from an email link, e.g. an expired confirmation */
  linkError?: string;
}) {
  const [state, formAction, pending] = useActionState(mode === "login" ? signIn : signUp, initialState);
  const isSignup = mode === "signup";
  const error = state.status === "error" ? state.message : linkError;

  if (state.status === "check-email") {
    return (
      <div role="status" className="flex flex-col items-center text-center">
        <MailCheck aria-hidden className="mb-3 size-10 text-accent" />
        <h2 className="text-lg font-semibold text-ink">Check your email</h2>
        <p className="mt-2 text-sm text-muted">
          We sent a confirmation link to <span className="text-ink">{state.email}</span>. Open it in
          this browser to finish creating your account.
        </p>
        <p className="mt-4 text-xs text-faint">
          No email after a few minutes? Check spam, or try signing up again later.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="next" value={next} />

      {error && (
        <p role="alert" className="flex gap-2 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-ink">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-red-400" />
          {error}
        </p>
      )}

      {isSignup && (
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            Display name <span className="font-normal text-faint">(optional)</span>
          </span>
          <input name="displayName" autoComplete="nickname" maxLength={80} defaultValue={state.displayName} className={inputClass} />
        </label>
      )}

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
        <input name="email" type="email" required autoComplete="email" defaultValue={state.email} className={inputClass} />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={isSignup ? 8 : undefined}
          autoComplete={isSignup ? "new-password" : "current-password"}
          className={inputClass}
        />
        {isSignup && <span className="mt-1.5 block text-xs text-faint">At least 8 characters.</span>}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-canvas hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
      >
        {pending && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
        {isSignup ? "Create account" : "Sign in"}
      </button>

      <p className="text-center text-sm text-muted">
        {isSignup ? "Already have an account? " : "New to PhoneLab? "}
        <Link
          href={`${isSignup ? "/login" : "/signup"}${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-medium text-accent hover:underline"
        >
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
