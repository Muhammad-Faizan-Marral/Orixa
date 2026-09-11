"use server";

import { createClient } from "@/lib/supabase/server";
import { signupSchema } from "@/validations/auth.schema";
import { rateLimit } from "@/lib/rate-limit";

export type SignupState = {
  error?: string;
  success?: boolean;
};

export async function signup(
  _previousState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signupSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || "Invalid form data.",
    };
  }

  const { name, email, password } = parsed.data;
  const rate = rateLimit(`signup:${parsed.data.email}`, 3, 60 * 1000); // 3 signups per minute

  if (!rate.success) {
    return {
      error: "Too many signup attempts. Please try again later.",
    };
  }
  const supabase = await createClient();
  const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
    : "http://localhost:3000");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        username: name.toLowerCase().replace(/\s+/g, ""),
      },
      emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    console.error("Supabase signUp failed:", {
      status: error.status,
      code: error.code,
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
          "Our sign-up service is temporarily unavailable. Please try again.",
      };
    }
    return {
      error: error.message || "Something went wrong. Please try again.",
    };
  }

  // Extra safety: some cases return empty identities
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { error: "An account with this email already exists." };
  }

  return { success: true };
}
