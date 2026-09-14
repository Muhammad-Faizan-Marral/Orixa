import {
  ALLOWED_UPLOAD_TYPES,
  MAX_UPLOAD_SIZE,
  type UploadType,
} from "@/features/profile/upload.constants";

/** Content-based MIME detection (trust bytes, not browser type). */
function detectFileMimeType(buffer: ArrayBuffer): string | null {
  const bytes = new Uint8Array(buffer);

  // JPEG
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }

  // PNG
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

  // GIF
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

  // WEBP
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

  // PDF — %PDF anywhere in first 1KB (handles BOM / leading junk from some cloud exports)
  const scanLen = Math.min(bytes.length, 1024);
  for (let i = 0; i < scanLen - 4; i++) {
    if (
      bytes[i] === 0x25 && // %
      bytes[i + 1] === 0x50 && // P
      bytes[i + 2] === 0x44 && // D
      bytes[i + 3] === 0x46 // F
    ) {
      return "application/pdf";
    }
  }

  return null;
}

const LOOSE_BROWSER_TYPES = new Set([
  "",
  "application/octet-stream",
  "binary/octet-stream",
  "application/x-pdf",
  "application/acrobat",
  "applications/vnd.pdf",
  "text/plain", // rare mislabel from some pickers
]);

export async function validateUpload(file: File, type: UploadType) {
  if (!(file instanceof File)) {
    throw new Error("Invalid file.");
  }

  if (file.size <= 0) {
    throw new Error(
      "File is empty or still downloading. If this is from Google Drive, download it first, then upload.",
    );
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("File size must be 5MB or less.");
  }

  const allowed =
    type === "resume"
      ? (ALLOWED_UPLOAD_TYPES.resume as readonly string[])
      : (ALLOWED_UPLOAD_TYPES.image as readonly string[]);

  // Read bytes first — source of truth
  let buffer: ArrayBuffer;
  try {
    buffer = await file.arrayBuffer();
  } catch {
    throw new Error(
      "Could not read the file. Download it to your device and try again.",
    );
  }

  if (!buffer || buffer.byteLength <= 0) {
    throw new Error(
      "File is empty or still downloading. Save it locally, then upload.",
    );
  }

  // Size mismatch = incomplete cloud download
  if (file.size > 0 && buffer.byteLength < file.size * 0.9) {
    throw new Error(
      "File did not finish downloading (common with Google Drive). Download the PDF to your device, then upload.",
    );
  }

  const detectedMimeType = detectFileMimeType(buffer);

  if (!detectedMimeType) {
    throw new Error(
      type === "resume"
        ? "This does not look like a valid PDF. Please upload a real PDF resume."
        : "Unable to verify the file type. Please use JPEG, PNG, WebP, or GIF.",
    );
  }

  if (!allowed.includes(detectedMimeType)) {
    throw new Error(
      type === "resume"
        ? "Only PDF resumes are allowed."
        : "This image type is not allowed.",
    );
  }

  // Browser MIME is advisory only. Allow empty / octet-stream / mismatch
  // as long as magic bytes match (fixes Google Drive, iCloud, OneDrive pickers).
  const browserType = (file.type || "").toLowerCase().trim();
  if (
    browserType &&
    !LOOSE_BROWSER_TYPES.has(browserType) &&
    !allowed.includes(browserType) &&
    browserType !== detectedMimeType
  ) {
    // Soft warning path: still accept if content is valid
    // (some Android browsers send image/jpg instead of image/jpeg etc.)
    const normalized =
      browserType === "image/jpg" ? "image/jpeg" : browserType;
    if (!allowed.includes(normalized) && normalized !== detectedMimeType) {
      // Content wins — do not reject
    }
  }

  return {
    buffer,
    mimeType: detectedMimeType,
  };
}