import type { WizardStepId } from "@/features/portfolio/wizard-steps";
import type { FieldErrors, ValidationState } from "./types";

export const URL_RE = /^https?:\/\/.+/i;
export const PHONE_RE = /^[+]?[\d\s\-()]{7,20}$/;
export const SKILL_NAME_RE = /^[a-zA-Z0-9+#.\- ]+$/;

/**
 * Validates a single wizard step and returns a map of field-key -> message.
 * An empty object means the step is valid.
 *
 * Field keys match what each step component reads from `fieldErrors`
 * (e.g. `skill-${id}`, `exp-company-${id}`, `proj-title-${id}`, ...).
 */
export function validateStep(
  stepId: WizardStepId,
  state: ValidationState,
): FieldErrors {
  const errors: FieldErrors = {};

  if (stepId === "basics") {
    if (!state.name.trim() || state.name.trim().length < 2) {
      errors.name = "Full name required (min 2 chars). Example: Jhon Doe";
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
    if (state.linkedinUrl.trim() && !URL_RE.test(state.linkedinUrl.trim())) {
      errors.linkedinUrl =
        "Must start with http:// or https://. Example: https://linkedin.com/in/jhon";
    }
    if (state.githubUrl.trim() && !URL_RE.test(state.githubUrl.trim())) {
      errors.githubUrl =
        "Must start with http:// or https://. Example: https://github.com/jhon";
    }
  }

  if (stepId === "skills") {
    state.skills.forEach((s, i) => {
      if (!s.name.trim() || s.name.trim().length < 2) {
        errors[`skill-${s.id}`] =
          `Skill #${i + 1}: name min 2 chars. Example: React`;
      } else if (!SKILL_NAME_RE.test(s.name.trim())) {
        errors[`skill-${s.id}`] =
          `Skill #${i + 1}: only letters, numbers, + # . - allowed`;
      }
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
      if (p.url?.trim() && !URL_RE.test(p.url.trim())) {
        errors[`proj-url-${p.id}`] =
          `Project #${i + 1}: URL must start with http:// or https://`;
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
      if (c.credentialUrl?.trim() && !URL_RE.test(c.credentialUrl.trim())) {
        errors[`cert-url-${c.id}`] =
          `Certificate #${i + 1}: URL must start with http:// or https://`;
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

  // "resume" and "review" steps have no blocking field-level validation.

  return errors;
}
