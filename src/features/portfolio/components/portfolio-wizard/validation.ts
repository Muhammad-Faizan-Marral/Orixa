import type { WizardStepId } from "@/features/portfolio/wizard-steps";
import type { FieldErrors, ValidationState } from "./types";
import { ensureHttpsUrl, isOptionalHttpUrl } from "./utils";

export const URL_RE = /^https?:\/\/.+/i;
export const PHONE_RE = /^[+]?[\d\s\-()]{7,20}$/;

/**
 * All fields are optional.
 * Only validate format / max-length when the user actually filled something.
 * Empty arrays / empty items are allowed (they get filtered on save).
 */
export function validateStep(
  stepId: WizardStepId,
  state: ValidationState,
): FieldErrors {
  const errors: FieldErrors = {};

  if (stepId === "basics") {
    // Name is optional, but if filled must be reasonable length
    if (state.name.trim() && state.name.trim().length < 2) {
      errors.name =
        "Name too short (min 2 chars if provided). Example: Ali Khan";
    }
    if (state.name.trim().length > 100) {
      errors.name = "Name max 100 characters.";
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
      // Empty skill rows are allowed (filtered on save)
      if (name && name.length > 60) {
        errors[`skill-${s.id}`] = `Skill #${i + 1}: max 60 characters`;
      }
    });
  }

  if (stepId === "experience") {
    state.experience.forEach((e, i) => {
      // Empty rows allowed. Only check if partially filled
      const hasAny =
        e.company.trim() || e.role.trim() || (e.description ?? "").trim();
      if (hasAny) {
        if (e.company.trim().length > 120) {
          errors[`exp-company-${e.id}`] =
            `Experience #${i + 1}: company max 120 chars`;
        }
        if (e.role.trim().length > 120) {
          errors[`exp-role-${e.id}`] =
            `Experience #${i + 1}: role max 120 chars`;
        }
      }
    });
  }

  if (stepId === "projects") {
    state.projects.forEach((p, i) => {
      const title = p.title.trim();
      // Empty project rows allowed
      if (title && title.length > 120) {
        errors[`proj-title-${p.id}`] = `Project #${i + 1}: title max 120 chars`;
      }
      if (p.url?.trim() && !isOptionalHttpUrl(p.url)) {
        errors[`proj-url-${p.id}`] =
          `Project #${i + 1}: enter a valid URL (https:// is added automatically)`;
      }
    });
  }

  if (stepId === "education") {
    state.education.forEach((e, i) => {
      if (e.institution.trim().length > 150) {
        errors[`edu-inst-${e.id}`] =
          `Education #${i + 1}: institution max 150 chars`;
      }
    });
  }

  if (stepId === "certificates") {
    state.certificates.forEach((c, i) => {
      if (c.name.trim().length > 150) {
        errors[`cert-name-${c.id}`] =
          `Certificate #${i + 1}: name max 150 chars`;
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

  // mode / resume / review → no field validation
  return errors;
}

/** Validate every content step and return all errors + which steps failed */
export function validateAllSteps(state: ValidationState): {
  errors: FieldErrors;
  failedSteps: WizardStepId[];
} {
  const stepIds: WizardStepId[] = [
    "basics",
    "skills",
    "experience",
    "projects",
    "education",
    "certificates",
    "seo",
  ];

  const errors: FieldErrors = {};
  const failedSteps: WizardStepId[] = [];

  for (const id of stepIds) {
    const stepErrors = validateStep(id, state);
    if (Object.keys(stepErrors).length > 0) {
      failedSteps.push(id);
      Object.assign(errors, stepErrors);
    }
  }

  return { errors, failedSteps };
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
