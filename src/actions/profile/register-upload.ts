"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { uploadService } from "@/services/profile/upload.service";

export async function registerUpload(input: {
  type: string;
  url: string;
  mimeType?: string | null;
  size?: number | null;
}) {
  await requireUser();

  const profile = await requireProfile();

  try {
    const upload = await uploadService.registerUpload(profile.id, input);

    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: "Upload registered.",
      data: upload,
    };
  } catch (error) {
    console.error("registerUpload:", error);

    return {
      success: false,
      message: "Unable to register upload.",
    };
  }
}
