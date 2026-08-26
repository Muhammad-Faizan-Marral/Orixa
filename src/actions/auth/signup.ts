"use server";

import { createClient } from "@/lib/supabase/server";

export type SignupState = {
  error?: string;
  success?: boolean;
};

export async function signup(
  _previousState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username:name,
      },
      emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    // Full diagnostic detail server-side only — the auth-js error message
    // is unreliable when the Auth server returns a body with no
    // msg/message/error fields (you'll see "{}"), so status + code are
    // what actually tell you what happened. Check these against
    // Supabase Dashboard -> Logs -> Auth Logs to confirm.
    console.error("Supabase signUp failed:", {
      status: error.status,
      code: error.code,
      name: error.name,
      message: error.message,
    });

    if (error.code === "user_already_exists") {
      return { error: "An account with this email already exists." };
    }

    if (error.code === "weak_password") {
      return { error: "Please choose a stronger password." };
    }

    if (error.status && error.status >= 500) {
      return {
        error:
          "Our sign-up service is temporarily unavailable. Please try again in a moment.",
      };
    }

    if (!error.status || error.message === "{}") {
      return {
        error:
          "We couldn't reach the authentication service. Please check your connection and try again.",
      };
    }

    return { error: error.message };
  }

  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { error: "An account with this email already exists." };
  }

  return { success: true };
}
