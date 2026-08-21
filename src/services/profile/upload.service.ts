import { uploadRepository } from "@/repositories/upload.repository";

export class UploadService {
  async getUploads(profileId: string) {
    return uploadRepository.findByProfileId(profileId);
  }

  async registerUpload(
    profileId: string,
    data: {
      type: string;
      url: string;
      mimeType?: string | null;
      size?: number | null;
    },
  ) {
    if (!data.url) {
      throw new Error("Upload URL is required.");
    }

    if (!data.type) {
      throw new Error("Upload type is required.");
    }

    return uploadRepository.create({
      profileId,
      ...data,
    });
  }

  async deleteUpload(profileId: string, uploadId: string) {
    return uploadRepository.markDeleted(uploadId, profileId);
  }
}

export const uploadService = new UploadService();
