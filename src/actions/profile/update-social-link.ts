"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { socialLinkService } from "@/services/profile/social-link.service";

export async function updateSocialLink(input: {
  id: string;
  platform: string;
  url: string;
  displayOrder?: number;
}) {
  await requireUser();

  const profile = await requireProfile();

  try {
    const link = await socialLinkService.updateSocialLink(profile.id, {
      id: input.id,
      platform: input.platform,
      url: input.url,
      displayOrder: input.displayOrder ?? 0,
    });

    if (!link) {
      return {
        success: false,
        message: "Social link not found.",
      };
    }

    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: "Social link updated.",
      data: link,
    };
  } catch (error) {
    console.error("updateSocialLink:", error);

    return {
      success: false,
      message: "Unable to update social link.",
    };
  }
}
