"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { socialLinkService } from "@/services/profile/social-link.service";

export async function deleteSocialLink(id: string) {
  await requireUser();

  const profile = await requireProfile();

  try {
    const deleted = await socialLinkService.deleteSocialLink(profile.id, id);

    if (!deleted) {
      return {
        success: false,
        message: "Social link not found.",
      };
    }

    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: "Social link deleted.",
    };
  } catch (error) {
    console.error("deleteSocialLink:", error);

    return {
      success: false,
      message: "Unable to delete social link.",
    };
  }
}
