import type { CreatePortfolioInput } from "@/validations/portfolio.schema";
export type PortfolioProject = {
  id: string;
  title: string;
  description?: string;
  url?: string;
  technologies?: string[];
  imageUrl?: string;
};

export type PortfolioExperience = {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
};

export type PortfolioSkill = {
  id: string;
  name: string;
  level?: string;
};

export type PortfolioEducation = {
  id: string;
  institution: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type PortfolioCertificate = {
  id: string;
  name: string;
  issuer?: string;
  issueDate?: string;
  credentialUrl?: string;
};

export type PortfolioDataInput = {
  headline: string;
  about: string;

  projects: PortfolioProject[];
  experience: PortfolioExperience[];
  skills: PortfolioSkill[];
  education: PortfolioEducation[];
  certificates: PortfolioCertificate[];

  resumeUrl: string;

  theme: string;

  animations: boolean;

  componentSelection: Record<string, unknown>;

  designPreferences: Record<string, unknown>;

  seo: Record<string, unknown>;
};

export type PortfolioComponentSelection = {
  showHero: boolean;
  showAbout: boolean;
  showSkills: boolean;
  showExperience: boolean;
  showProjects: boolean;
  showEducation: boolean;
  showCertificates: boolean;
  showContact: boolean;
};

export type PortfolioDesignPreferences = {
  layout: "standard" | "wide" | "centered";
  accentColor: string;
  fontFamily: string;
  borderRadius: "none" | "small" | "medium" | "large";
  cardStyle: "flat" | "bordered" | "elevated";
};
export type PortfolioSEO = {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
  noIndex: boolean;
};


export type PortfolioFormValues = CreatePortfolioInput;
