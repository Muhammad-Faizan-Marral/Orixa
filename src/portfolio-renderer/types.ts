export type RendererProject = {
  id?: string;
  title: string;
  description?: string;
  url?: string;
  technologies?: string[];
  imageUrl?: string;
};

export type RendererExperience = {
  id?: string;
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
};

export type RendererSkill = {
  id?: string;
  name: string;
  level?: string;
};

export type RendererEducation = {
  id?: string;
  institution: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type RendererCertificate = {
  id?: string;
  name: string;
  issuer?: string;
  issueDate?: string;
  credentialUrl?: string;
};

export type SectionSelection = {
  enabled: boolean;
  variant: string;
};

export type RendererComponentSelection = {
  navbar?: SectionSelection;
  hero?: SectionSelection;
  about?: SectionSelection;
  skills?: SectionSelection;
  projects?: SectionSelection;
  experience?: SectionSelection;
  education?: SectionSelection;
  certificates?: SectionSelection;
  contact?: SectionSelection;
  footer?: SectionSelection;
};

export type RendererDesignPreferences = {
  themeMode?: "light" | "dark";
  layout?: "standard" | "wide" | "centered";
  accentColor?: string;
  fontFamily?: string;
  borderRadius?: "none" | "small" | "medium" | "large";
  cardStyle?: "flat" | "bordered" | "elevated";
};

export type RendererSEO = {
  title?: string;
  description?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export type PortfolioRenderConfig = {
  name?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  headline?: string | null;
  about?: string | null;
  projects?: RendererProject[];
  experience?: RendererExperience[];
  skills?: RendererSkill[];
  education?: RendererEducation[];
  certificates?: RendererCertificate[];
  resumeUrl?: string | null;
  theme?: string | null;
  animations?: boolean;
  componentSelection?: RendererComponentSelection;
  designPreferences?: RendererDesignPreferences;
  seo?: RendererSEO;
};

export type PublicProfileMeta = {
  username: string;
  fullName?: string | null;
  avatarUrl?: string | null;
};