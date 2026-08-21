"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { uploadService } from "@/services/profile/upload.service";

export async function deleteUpload(uploadId: string) {
  await requireUser();

  const profile = await requireProfile();

  try {
    const upload = await uploadService.deleteUpload(profile.id, uploadId);

    if (!upload) {
      return {
        success: false,
        message: "Upload not found.",
      };
    }

    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: "Upload deleted.",
    };
  } catch (error) {
    console.error("deleteUpload:", error);

    return {
      success: false,
      message: "Unable to delete upload.",
    };
  }
}
