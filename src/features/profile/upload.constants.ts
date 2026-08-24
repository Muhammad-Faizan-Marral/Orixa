export const PUBLIC_UPLOAD_BUCKET = "portfolio-public";
export const PRIVATE_UPLOAD_BUCKET = "portfolio-private";

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
export const MAX_USER_STORAGE = 100 * 1024 * 1024;
export const MAX_USER_FILES = 50;

export const ALLOWED_UPLOAD_TYPES = {
  image: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
  resume: ["application/pdf"],
} as const;

export type UploadType = "avatar" | "project-image" | "resume";
