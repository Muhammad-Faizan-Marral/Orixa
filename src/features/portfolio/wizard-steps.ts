export const WIZARD_STEPS = [
  { id: "mode", label: "Start" },
  { id: "basics", label: "Basics" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "certificates", label: "Certificates" },
  { id: "resume", label: "Resume" },
  { id: "seo", label: "SEO" },
  { id: "review", label: "Review" },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]["id"];

/** Steps after mode select (used for progress bar) */
export const CONTENT_STEPS = WIZARD_STEPS.filter((s) => s.id !== "mode");
