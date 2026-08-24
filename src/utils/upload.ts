import {
  ALLOWED_UPLOAD_TYPES,
  MAX_UPLOAD_SIZE,
  type UploadType,
} from "@/features/profile/upload.constants";

function detectFileMimeType(buffer: ArrayBuffer): string | null {
  const bytes = new Uint8Array(buffer);

  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38 &&
    (bytes[4] === 0x37 || bytes[4] === 0x39) &&
    bytes[5] === 0x61
  ) {
    return "image/gif";
  }

  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  if (
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  ) {
    return "application/pdf";
  }

  return null;
}

export async function validateUpload(
  file: File,
  type: UploadType,
) {
  if (!(file instanceof File)) {
    throw new Error("Invalid file.");
  }

  if (file.size <= 0) {
    throw new Error("File is empty.");
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("File size must be 5MB or less.");
  }

  const allowed =
    type === "resume"
      ? ALLOWED_UPLOAD_TYPES.resume
      : ALLOWED_UPLOAD_TYPES.image;

  if (!allowed.includes(file.type as never)) {
    throw new Error("This file type is not allowed.");
  }

  const buffer = await file.arrayBuffer();
  const detectedMimeType = detectFileMimeType(buffer);

  if (!detectedMimeType) {
    throw new Error("Unable to verify the file type.");
  }

  if (!allowed.includes(detectedMimeType as never)) {
    throw new Error("The actual file type is not allowed.");
  }

  if (detectedMimeType !== file.type) {
    throw new Error("File MIME type does not match its content.");
  }

  return {
    buffer,
    mimeType: detectedMimeType,
  };
}
