"use server";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { uploadService } from "@/services/profile/upload.service";
import type { UploadType } from "@/features/profile/upload.constants";

export async function getUploads(params: { type: UploadType; portfolioId?: string }) {
  await requireUser();
  const profile = await requireProfile();

  const uploads = await uploadService.getUploads(profile.id);

  const filtered = uploads.filter((upload) => {
    if (upload.status !== "active") return false;
    if (upload.type !== params.type) return false;
    if (params.portfolioId) return upload.storagePath.includes(params.portfolioId);
    return true;
  });

  return { success: true as const, data: filtered };
}
