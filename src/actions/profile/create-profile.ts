"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { profileService } from "@/services/profile/profile.service";

import type { CreateProfileInput } from "@/validations/profile.schema";

export type CreateProfileResult = {
  success: boolean;
  message?: string;
};

/**
 * Do NOT call redirect() here.
 * Client components that await this action will treat NEXT_REDIRECT as an error.
 */
export async function createProfile(
  data: CreateProfileInput,
): Promise<CreateProfileResult> {
  try {
    const user = await requireUser();
    await profileService.createProfile(user.id, data);

    revalidatePath("/dashboard");
    revalidatePath("/onboarding");

    return { success: true };
  } catch (error) {
    console.error("[createProfile]", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create profile.",
    };
  }
}