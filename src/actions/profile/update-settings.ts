"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { settingsService } from "@/services/profile/settings.service";
import { UpdateSettingsInput } from "@/validations/settings.schema";

export async function updateSettings(input:UpdateSettingsInput) {
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
