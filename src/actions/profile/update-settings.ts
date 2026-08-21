"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { settingsService } from "@/services/profile/settings.service";

export async function updateSettings(input: {
  language: string;
  timezone?: string | null;
  publicProfile: boolean;
  emailNotifications: boolean;
  themeMode?: "light" | "dark" | "system" | null;
}) {
  await requireUser();

  const profile = await requireProfile();

  try {
    const settings = await settingsService.updateSettings(profile.id, input);

    revalidatePath("/dashboard/settings");

    return {
      success: true,
      message: "Settings updated.",
      data: settings,
    };
  } catch (error) {
    console.error("updateSettings:", error);

    return {
      success: false,
      message: "Unable to update settings.",
    };
  }
}
