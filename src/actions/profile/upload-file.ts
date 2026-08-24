"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { uploadService } from "@/services/profile/upload.service";
import { uploadTypeSchema } from "@/validations/upload.schema";

export async function uploadFile(formData: FormData) {
  const user = await requireUser();
  const profile = await requireProfile();

  if (profile.userId !== user.id) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  const file = formData.get("file");
  const type = formData.get("type");
  const portfolioIdValue = formData.get("portfolioId");

  if (!(file instanceof File)) {
    return {
      success: false,
      message: "Please select a file.",
    };
  }

  const parsedType = uploadTypeSchema.safeParse(type);

  if (!parsedType.success) {
    return {
      success: false,
      message: "Invalid upload type.",
    };
  }

  const portfolioId =
    typeof portfolioIdValue === "string" && portfolioIdValue.length > 0
      ? portfolioIdValue
      : undefined;

  try {
    const result = await uploadService.uploadFile({
      profileId: profile.id,
      userId: user.id,
      portfolioId,
      type: parsedType.data,
      file,
    });

    revalidatePath("/dashboard/profile");

    if (portfolioId) {
      revalidatePath(`/dashboard/portfolios/${portfolioId}`);
      revalidatePath(`/dashboard/portfolios/${portfolioId}/edit`);
    }

    return {
      success: true,
      message: "File uploaded successfully.",
      data: result.upload,
    };
  } catch (error) {
    console.error("uploadFile:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to upload file.",
    };
  }
}
