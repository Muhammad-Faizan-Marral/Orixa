"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { uploadService } from "@/services/profile/upload.service";

export async function deleteUpload(uploadId: string) {
  const user = await requireUser();
  const profile = await requireProfile();

  if (profile.userId !== user.id) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (!uploadId?.trim()) {
    return {
      success: false,
      message: "Invalid upload ID.",
    };
  }

  try {
    await uploadService.deleteFile({
      uploadId,
      profileId: profile.id,
    });

    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: "File deleted successfully.",
    };
  } catch (error) {
    console.error("deleteUpload:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to delete file.",
    };
  }
}
