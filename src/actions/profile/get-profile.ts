"use server";

import { requireUser } from "@/lib/auth/require-user";
import { profileService } from "@/services/profile/profile.service";

export async function getCurrentProfile() {
  const user = await requireUser();

  const profile =
    await profileService.getProfile(user.id);

  if (!profile) {
    return {
      success: false,
      profile: null,
    };
  }

  return {
    success: true,
    profile,
  };
}