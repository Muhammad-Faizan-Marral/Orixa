"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/require-user";
import { profileService } from "@/services/profile/profile.service";

import type { CreateProfileInput } from "@/validations/profile.schema";

export async function createProfile(
  data: CreateProfileInput,
) {
  const user = await requireUser();

  try {
    await profileService.createProfile(user.id, data);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create profile.",
    };
  }

  revalidatePath("/dashboard");

  redirect("/dashboard");
}