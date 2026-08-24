import { randomUUID } from "crypto";

import {
  PRIVATE_UPLOAD_BUCKET,
  PUBLIC_UPLOAD_BUCKET,
  type UploadType,
} from "@/features/profile/upload.constants";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

export function createUploadPath(params: {
  userId: string;
  portfolioId?: string;
  type: UploadType;
  mimeType: string;
}) {
  const extension = EXTENSIONS[params.mimeType];

  if (!extension) {
    throw new Error("Unsupported upload MIME type.");
  }

  const id = randomUUID();

  if (params.type === "avatar") {
    return {
      bucket: PUBLIC_UPLOAD_BUCKET,
      path: `profiles/${params.userId}/avatar/${id}.${extension}`,
    };
  }

  if (!params.portfolioId) {
    throw new Error("Portfolio ID is required for this upload.");
  }

  if (params.type === "resume") {
    return {
      bucket: PRIVATE_UPLOAD_BUCKET,
      path: `portfolios/${params.userId}/${params.portfolioId}/resume/${id}.${extension}`,
    };
  }

  return {
    bucket: PUBLIC_UPLOAD_BUCKET,
    path: `portfolios/${params.userId}/${params.portfolioId}/projects/${id}.${extension}`,
  };
}
