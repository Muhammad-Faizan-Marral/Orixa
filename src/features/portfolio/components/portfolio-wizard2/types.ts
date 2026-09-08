import type { Dispatch, SetStateAction } from "react";
import type { WizardStepId } from "@/features/portfolio/wizard-steps";

export type Setter<T> = Dispatch<SetStateAction<T>>;

/**
 * Creation mode.
 * NOTE: `CreationModeSelect` only ever calls `onSelect("resume" | "manual")`,
 * so this type intentionally does not include an "ai" option.
 */
export type CreationMode = "manual" | "resume";

export type Project = {
  id: string;
  title: string;
  description?: string;
  url?: string;
  technologies?: string[];
  imageUrl?: string;
};
export type ProjectItem = Project;

export type Experience = {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
};
export type ExperienceItem = Experience;

export type Skill = { id: string; name: string; level?: string };

export type Education = {
  id: string;
  institution: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};
export type EducationItem = Education;

export type Certificate = {
  id: string;
  name: string;
  issuer?: string;
  issueDate?: string;
  credentialUrl?: string;
};
export type CertificateItem = Certificate;

export type PortfolioWizardProps = {
  portfolio: { id: string; title: string; slug: string; status: string };
  data: {
    name: string | null;
    prompt: string | null;
    avatarUrl: string | null;
    phone: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    headline: string | null;
    about: string | null;
    projects: Project[] | null;
    experience: Experience[] | null;
    skills: Skill[] | null;
    education: Education[] | null;
    certificates: Certificate[] | null;
    resumeUrl: string | null;
    theme: string | null;
    animations: boolean | null;
    componentSelection: Record<string, unknown> | null;
    designPreferences: Record<string, unknown> | null;
    seo: Record<string, unknown> | null;
  } | null;
  isNew?: boolean;
};

export type FieldErrors = Record<string, string>;

export type ValidationState = {
  name: string;
  headline: string;
  about: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  prompt: string;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certificates: Certificate[];
  seoTitle: string;
  seoDescription: string;
};

export type Message = { type: "success" | "error"; text: string } | null;

export type { WizardStepId };
