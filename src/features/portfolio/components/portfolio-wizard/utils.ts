import type { PortfolioWizardProps } from "./types";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export function createId() {
  return crypto.randomUUID();
}

export function isPortfolioEmpty(data: PortfolioWizardProps["data"]) {
  if (!data) return true;

  const hasContent =
    (data.name && data.name.trim()) ||
    (data.headline && data.headline.trim()) ||
    (data.about && data.about.trim()) ||
    (data.skills && data.skills.length > 0) ||
    (data.projects && data.projects.length > 0) ||
    (data.experience && data.experience.length > 0);

  return !hasContent;
}

/**
 * Throws a user-friendly Error if the file isn't a resume-shaped PDF.
 * Cloud pickers (Google Drive, etc.) often send empty or generic MIME types.
 */
export function assertValidResumeFile(file: File) {
  const name = (file.name || "").toLowerCase();
  const type = (file.type || "").toLowerCase().trim();

  const looksLikePdf =
    type === "application/pdf" ||
    type === "application/x-pdf" ||
    type === "application/octet-stream" ||
    type === "binary/octet-stream" ||
    type === "" ||
    name.endsWith(".pdf");

  if (!looksLikePdf) {
    throw new Error("Only PDF resume files are supported.");
  }

  if (file.size <= 0) {
    throw new Error(
      "File is empty or still downloading. If from Google Drive, download it first, then upload.",
    );
  }

  if (file.size > MAX_RESUME_BYTES) {
    throw new Error("Resume must be smaller than 5MB.");
  }
}

/**
 * Fully read a File into memory and return a stable File.
 * Fixes Google Drive / cloud picker incomplete downloads and
 * "fetch failed" on first attempt.
 */
export async function materializeFile(file: File): Promise<File> {
  let buffer: ArrayBuffer;
  try {
    buffer = await file.arrayBuffer();
  } catch {
    throw new Error(
      "Could not read the file. Download the PDF to your device and try again.",
    );
  }

  if (!buffer || buffer.byteLength === 0) {
    throw new Error(
      "File is empty. Download the PDF to your device, then upload.",
    );
  }

  // Incomplete cloud download
  if (file.size > 512 && buffer.byteLength < file.size * 0.85) {
    throw new Error(
      "File did not finish downloading (common with Google Drive). Download the PDF locally, then upload.",
    );
  }

  // Quick PDF magic check client-side
  const bytes = new Uint8Array(buffer);
  let isPdf = false;
  const scan = Math.min(bytes.length, 1024);
  for (let i = 0; i < scan - 4; i++) {
    if (
      bytes[i] === 0x25 &&
      bytes[i + 1] === 0x50 &&
      bytes[i + 2] === 0x44 &&
      bytes[i + 3] === 0x46
    ) {
      isPdf = true;
      break;
    }
  }
  if (!isPdf) {
    throw new Error(
      "This file is not a valid PDF. Please upload a real PDF resume.",
    );
  }

  const name = file.name?.toLowerCase().endsWith(".pdf")
    ? file.name
    : `${file.name || "resume"}.pdf`;

  return new File([buffer], name, {
    type: "application/pdf",
    lastModified: file.lastModified || Date.now(),
  });
}
/**
 * Ensure a social/profile URL starts with https://.
 * Empty stays empty (field is optional).
 * "linkedin.com/in/x" → "https://linkedin.com/in/x"
 * "https://..." stays unchanged.
 */
export function ensureHttpsUrl(value: string | null | undefined): string {
  const v = (value ?? "").trim();
  if (!v) return "";

  if (/^https?:\/\//i.test(v)) return v;

  // Strip leading slashes then prefix
  const cleaned = v.replace(/^\/+/, "");
  if (!cleaned) return "";

  return `https://${cleaned}`;
}

/**
 * True if value is empty OR a valid http(s) URL (after optional auto-prefix).
 */
export function isOptionalHttpUrl(value: string | null | undefined): boolean {
  const v = (value ?? "").trim();
  if (!v) return true;
  const normalized = ensureHttpsUrl(v);
  try {
    const u = new URL(normalized);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}