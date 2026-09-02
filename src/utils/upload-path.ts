import { randomUUID } from "crypto";

import {
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
    // A resume that the user can attach to a public portfolio must have a
    // stable public URL. It is still portfolio-scoped and can be deleted
    // immediately when the user removes it.
    return {
      bucket: PUBLIC_UPLOAD_BUCKET,
      path: `portfolios/${params.userId}/${params.portfolioId}/resume/${id}.${extension}`,
    };
  }

  return {
    bucket: PUBLIC_UPLOAD_BUCKET,
    path: `portfolios/${params.userId}/${params.portfolioId}/projects/${id}.${extension}`,
  };
}
