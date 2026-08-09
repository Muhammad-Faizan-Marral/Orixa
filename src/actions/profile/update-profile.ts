"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { profileService } from "@/services/profile/profile.service";
import type { UpdateProfileInput } from "@/validations/profile.schema";

export async function updateProfile(
  data: UpdateProfileInput,
) {
  const user = await requireUser();

  try {
    const profile =
      await profileService.updateProfile(
        user.id,
        data,
      );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");

    revalidatePath(
      `/${profile.username}`,
    );

    return {
      success: true,
      profile,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update profile.",
    };
  }
}