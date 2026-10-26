"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { safeNextPath } from "@/lib/safe-path";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = {
  status: "idle" | "error" | "check-email";
  message?: string;
  /** Field values to keep in the form after an error (never the password) */
  email?: string;
  displayName?: string;
};

const MIN_PASSWORD = 8;

async function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const h = await headers();
  return `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
}

/** Turns Supabase auth error codes into plain-language messages. */
function friendlyError(code: string | undefined, fallback: string) {
  switch (code) {
    case "invalid_credentials":
      return "That email and password don't match an account.";
    case "email_not_confirmed":
      return "Please confirm your email first. Check your inbox for the link we sent.";
    case "user_already_exists":
    case "email_exists":
      return "An account with this email already exists. Try signing in.";
    case "weak_password":
      return `Choose a stronger password (at least ${MIN_PASSWORD} characters, mixing letters and numbers).`;
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "email_address_invalid":
      return "That email address doesn't look valid.";
    default:
      return fallback;
  }
}

const notConfigured: AuthFormState = {
  status: "error",
  message: "Accounts aren't set up yet: Supabase keys are missing from .env.local.",
};

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured) return notConfigured;
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { status: "error", message: "Enter your email and password.", email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { status: "error", message: friendlyError(error.code, "Sign-in failed. Please try again."), email };

  redirect(safeNextPath(formData.get("next")));
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured) return notConfigured;
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  const keep = { email, displayName };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: "error", message: "Enter a valid email address.", ...keep };
  if (password.length < MIN_PASSWORD) {
    return { status: "error", message: `Your password needs at least ${MIN_PASSWORD} characters.`, ...keep };
  }
  if (displayName.length > 80) return { status: "error", message: "Display name can be at most 80 characters.", ...keep };

  const supabase = await createClient();
  const next = safeNextPath(formData.get("next"));
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${await siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
      data: displayName ? { display_name: displayName } : undefined,
    },
  });
  if (error) return { status: "error", message: friendlyError(error.code, "Sign-up failed. Please try again."), ...keep };

  // With email confirmation turned off, Supabase signs the user in straight away.
  if (data.session) redirect(next);
  return { status: "check-email", email };
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
