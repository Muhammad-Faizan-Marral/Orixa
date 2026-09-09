"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/validations/auth.schema";
import { rateLimit } from "@/lib/rate-limit";

export type LoginState = {
  error?: string;
};

function safeRedirectTarget(next: FormDataEntryValue | null) {
  if (typeof next !== "string" || !next.trim()) {
    return "/dashboard";
  }
  if (!next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || "Invalid form data.",
    };
  }

  const { email, password } = parsed.data;
  const rate = rateLimit(`login:${parsed.data.email}`, 5, 60 * 1000); // 5 attempts per minute

  if (!rate.success) {
    return {
      error: "Too many login attempts. Please try again after a minute.",
    };
  }
  const next = safeRedirectTarget(formData.get("next"));

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.code === "invalid_credentials") {
      return { error: "Incorrect email or password." };
    }
    if (error.code === "email_not_confirmed") {
      return { error: "Please verify your email before logging in." };
    }
    return { error: error.message };
  }

  redirect(next);
}
