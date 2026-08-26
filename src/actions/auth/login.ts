"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  error?: string;
};

function safeRedirectTarget(next: FormDataEntryValue | null) {
  if (typeof next !== "string" || !next.trim()) {
    return "/dashboard";
  }

  // Only allow same-origin relative paths — never redirect off-site.
  if (!next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }

  return next;
}

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const next = safeRedirectTarget(formData.get("next"));

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      error: "Invalid form data.",
    };
  }

  if (!email.trim() || !password) {
    return {
      error: "Email and password are required.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    if (error.code === "invalid_credentials") {
      return {
        error: "Incorrect email or password.",
      };
    }

    if (error.code === "email_not_confirmed") {
      return {
        error: "Please verify your email before logging in.",
      };
    }

    return {
      error: error.message,
    };
  }

  redirect(next);
}