import { supabaseAdmin } from "@/lib/supabase/admin";

import {
  MAX_USER_FILES,
  MAX_USER_STORAGE,
  PRIVATE_UPLOAD_BUCKET,
  type UploadType,
} from "@/features/profile/upload.constants";

import { validateUpload } from "@/utils/upload";
import { createUploadPath } from "@/utils/upload-path";

import { uploadRepository } from "@/repositories/upload.repository";
import { portfolioService } from "@/services/portfolio/portfolio.service";

const PRIVATE_URL_TTL_SECONDS = 60 * 60;

export class UploadService {
  async uploadFile(params: {
    profileId: string;
    userId: string;
    portfolioId?: string;
    type: UploadType;
    file: File;
  }) {
    if (params.type === "avatar" && params.portfolioId) {
      throw new Error("Portfolio ID is not allowed for avatar uploads.");
    }

    if (params.type !== "avatar" && !params.portfolioId) {
      throw new Error("Portfolio ID is required for this upload.");
    }

    if (params.portfolioId) {
      const portfolio = await portfolioService.getPortfolioForUser(
        params.portfolioId,
        params.profileId,
      );

      if (!portfolio) {
        throw new Error("Portfolio not found.");
      }
    }

    const validation = await validateUpload(params.file, params.type);

    const target = createUploadPath({
      userId: params.userId,
      portfolioId: params.portfolioId,
      type: params.type,
      mimeType: validation.mimeType,
    });

    const reservation = await uploadRepository.reserve({
      profileId: params.profileId,
      type: params.type,
      bucket: target.bucket,
      storagePath: target.path,
      mimeType: validation.mimeType,
      size: params.file.size,
      maxBytes: MAX_USER_STORAGE,
      maxFiles: MAX_USER_FILES,
    });

    let storageUploaded = false;

    try {
      const { error } = await supabaseAdmin.storage
        .from(target.bucket)
        .upload(target.path, Buffer.from(validation.buffer), {
          contentType: validation.mimeType,
          cacheControl: "31536000",
          upsert: false,
        });

      if (error) {
        throw new Error("Unable to upload file.");
      }

      storageUploaded = true;

      let url: string | null = null;

      if (target.bucket !== PRIVATE_UPLOAD_BUCKET) {
        url = supabaseAdmin.storage
          .from(target.bucket)
          .getPublicUrl(target.path).data.publicUrl;
      }

      const upload = await uploadRepository.activate(
        reservation.id,
        params.profileId,
        url,
      );

      if (!upload) {
        throw new Error("Unable to finalize upload.");
      }

      return {
        upload,
        path: target.path,
        bucket: target.bucket,
        url,
      };
    } catch (error) {
      if (storageUploaded) {
        await supabaseAdmin.storage.from(target.bucket).remove([target.path]);
      }

      await uploadRepository.releaseReservation(
        reservation.id,
        params.profileId,
      );

      throw error;
    }
  }

  async deleteFile(params: { uploadId: string; profileId: string }) {
    const upload = await uploadRepository.findById(
      params.uploadId,
      params.profileId,
    );

    if (!upload || !["active", "deleting"].includes(upload.status)) {
      throw new Error("Upload not found.");
    }

    const deleting =
      upload.status === "deleting"
        ? upload
        : await uploadRepository.markDeleting(
            params.uploadId,
            params.profileId,
          );

    if (!deleting) {
      throw new Error("Upload is already being deleted.");
    }

    const { error } = await supabaseAdmin.storage
      .from(upload.bucket)
      .remove([upload.storagePath]);

    if (error) {
      await uploadRepository.restoreActive(params.uploadId, params.profileId);

      console.error("Supabase delete error:", error);
      throw new Error("Unable to delete file.");
    }

    const deleted = await uploadRepository.markDeleted(
      params.uploadId,
      params.profileId,
    );

    if (!deleted) {
      throw new Error(
        "File was removed from storage but metadata cleanup failed.",
      );
    }

    return deleted;
  }

  async deleteFileByUrl(params: { url: string; profileId: string }) {
    const upload = await uploadRepository.findByUrl(params.url, params.profileId);

    if (!upload) return false;

    await this.deleteFile({
      uploadId: upload.id,
      profileId: params.profileId,
    });

    return true;
  }

  async getUploads(profileId: string) {
    const uploads = await uploadRepository.findByProfileId(profileId);

    return Promise.all(
      uploads.map(async (upload) => {
        if (upload.bucket !== PRIVATE_UPLOAD_BUCKET) {
          return upload;
        }

        const { data, error } = await supabaseAdmin.storage
          .from(upload.bucket)
          .createSignedUrl(upload.storagePath, PRIVATE_URL_TTL_SECONDS);

        return {
          ...upload,
          url: error ? null : data.signedUrl,
        };
      }),
    );
  }
}

export const uploadService = new UploadService();
