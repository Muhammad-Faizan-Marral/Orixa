import type { WizardStepId } from "@/features/portfolio/wizard-steps";
import type { FieldErrors, ValidationState } from "./types";
import { ensureHttpsUrl, isOptionalHttpUrl } from "./utils";

export const URL_RE = /^https?:\/\/.+/i;
export const PHONE_RE = /^[+]?[\d\s\-()]{7,20}$/;

/**
 * Validates a single wizard step and returns a map of field-key -> message.
 * Empty object = step valid.
 *
 * LinkedIn / GitHub are optional.
 * If filled without protocol, we treat them as valid when https:// can be applied
 * (actual value is normalized on blur / save / resume parse).
 */
export function validateStep(
  stepId: WizardStepId,
  state: ValidationState,
): FieldErrors {
  const errors: FieldErrors = {};

  if (stepId === "basics") {
    if (!state.name.trim() || state.name.trim().length < 2) {
      errors.name = "Full name required (min 2 chars). Example: Ali Khan";
    }
    if (state.headline.trim().length > 200) {
      errors.headline = "Headline max 200 characters.";
    }
    if (state.about.trim().length > 5000) {
      errors.about = "About max 5000 characters.";
    }
    if (state.phone.trim() && !PHONE_RE.test(state.phone.trim())) {
      errors.phone = "Invalid phone. Example: +92 300 1234567";
    }

    // Optional — only error if non-empty AND not a valid URL (even after https://)
    if (state.linkedinUrl.trim() && !isOptionalHttpUrl(state.linkedinUrl)) {
      errors.linkedinUrl =
        "Enter a valid LinkedIn URL. Example: linkedin.com/in/yourname";
    }
    if (state.githubUrl.trim() && !isOptionalHttpUrl(state.githubUrl)) {
      errors.githubUrl =
        "Enter a valid GitHub URL. Example: github.com/yourname";
    }
  }

  if (stepId === "skills") {
    state.skills.forEach((s, i) => {
      const name = s.name.trim();
      if (!name || name.length < 1) {
        errors[`skill-${s.id}`] =
          `Skill #${i + 1}: name required. Example: React`;
      } else if (name.length > 60) {
        errors[`skill-${s.id}`] = `Skill #${i + 1}: max 60 characters`;
      }
      // Any characters allowed (e.g. scr/dc, C++, Node.js, UI/UX)
    });
  }

  if (stepId === "experience") {
    state.experience.forEach((e, i) => {
      if (!e.company.trim()) {
        errors[`exp-company-${e.id}`] =
          `Experience #${i + 1}: company required`;
      }
      if (!e.role.trim()) {
        errors[`exp-role-${e.id}`] = `Experience #${i + 1}: role required`;
      }
    });
  }

  if (stepId === "projects") {
    state.projects.forEach((p, i) => {
      if (!p.title.trim() || p.title.trim().length < 2) {
        errors[`proj-title-${p.id}`] =
          `Project #${i + 1}: title min 2 chars. Example: E-commerce App`;
      }
      if (p.url?.trim() && !isOptionalHttpUrl(p.url)) {
        errors[`proj-url-${p.id}`] =
          `Project #${i + 1}: enter a valid URL (https:// is added automatically)`;
      }
    });
  }

  if (stepId === "education") {
    state.education.forEach((e, i) => {
      if (!e.institution.trim()) {
        errors[`edu-inst-${e.id}`] =
          `Education #${i + 1}: institution required. Example: NUST`;
      }
    });
  }

  if (stepId === "certificates") {
    state.certificates.forEach((c, i) => {
      if (!c.name.trim()) {
        errors[`cert-name-${c.id}`] = `Certificate #${i + 1}: name required`;
      }
      if (c.credentialUrl?.trim() && !isOptionalHttpUrl(c.credentialUrl)) {
        errors[`cert-url-${c.id}`] = `Certificate #${i + 1}: enter a valid URL`;
      }
    });
  }

  if (stepId === "seo") {
    if (state.seoTitle.length > 70) {
      errors.seoTitle = "SEO title max 70 characters.";
    }
    if (state.seoDescription.length > 160) {
      errors.seoDescription = "SEO description max 160 characters.";
    }
  }

  return errors;
}

/** Normalize optional URL fields before save / next-step. */
export function normalizeWizardUrls<
  T extends {
    linkedinUrl?: string;
    githubUrl?: string;
    projects?: { url?: string }[];
    certificates?: { credentialUrl?: string }[];
  },
>(state: T): T {
  return {
    ...state,
    linkedinUrl: ensureHttpsUrl(state.linkedinUrl),
    githubUrl: ensureHttpsUrl(state.githubUrl),
    projects: state.projects?.map((p) => ({
      ...p,
      url: ensureHttpsUrl(p.url),
    })),
    certificates: state.certificates?.map((c) => ({
      ...c,
      credentialUrl: ensureHttpsUrl(c.credentialUrl),
    })),
  };
}
