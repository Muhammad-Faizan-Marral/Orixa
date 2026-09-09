"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resetPasswordSchema } from "@/validations/auth.schema";

export type ResetPasswordState = {
  error?: string;
};

export async function resetPassword(
  _previousState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const raw = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = resetPasswordSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || "Invalid form data.",
    };
  }

  const { password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    if (
      error.code === "session_not_found" ||
      error.message.toLowerCase().includes("session missing")
    ) {
      return {
        error: "This reset link has expired. Please request a new one.",
      };
    }
    return { error: error.message };
  }

  redirect("/auth/login?reset=success");
}
