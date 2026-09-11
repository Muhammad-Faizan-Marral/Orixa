"use server";

import { createClient } from "@/lib/supabase/server";
import { forgotPasswordSchema } from "@/validations/auth.schema";

export type ForgotPasswordState = {
  error?: string;
  success?: boolean;
};

export async function forgotPassword(
  _previousState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const raw = {
    email: formData.get("email"),
  };

  const parsed = forgotPasswordSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || "Please enter a valid email.",
    };
  }
  const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
    : "http://localhost:3000");

  const { email } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/auth/reset-password`,
  });

  if (error) {

    console.error("Forgot password error:", error.message);
  }

  return { success: true };
}
