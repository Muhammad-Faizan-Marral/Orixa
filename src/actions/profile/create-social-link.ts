"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { socialLinkService } from "@/services/profile/social-link.service";

export async function createSocialLink(input: {
  platform: string;
  url: string;
  displayOrder?: number;
}) {
  await requireUser();

  const profile = await requireProfile();

  try {
    const link = await socialLinkService.createSocialLink(profile.id, {
      platform: input.platform,
      url: input.url,
      displayOrder: input.displayOrder ?? 0,
    });

    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: "Social link added.",
      data: link,
    };
  } catch (error) {
    console.error("createSocialLink:", error);

    return {
      success: false,
      message: "Unable to add social link.",
    };
  }
}
