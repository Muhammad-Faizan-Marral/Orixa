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
 * Some browsers send an empty MIME type for PDFs, so we also fall back
 * to checking the file extension.
 */
export function assertValidResumeFile(file: File) {
  const looksLikePdf =
    file.type === "application/pdf" ||
    file.type === "" ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!looksLikePdf) {
    throw new Error("Only PDF resume files are supported.");
  }

  if (file.size <= 0 || file.size > MAX_RESUME_BYTES) {
    throw new Error("Resume must be smaller than 5MB.");
  }
}
