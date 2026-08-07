"use server";

import { profileService } from "@/services/profile/profile.service";

export async function checkUsername(username: string) {
  try {
    const available =
      await profileService.isUsernameAvailable(username);

    return {
      success: true,
      available,
      message: available
        ? "Username is available."
        : "Username is already taken.",
    };
  } catch {
    return {
      success: false,
      available: false,
      message: "Invalid username.",
    };
  }
}