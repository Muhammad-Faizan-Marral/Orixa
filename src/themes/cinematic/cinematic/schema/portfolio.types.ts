/**
 * View-model the cinematic theme renders from.
 * Everything here is already cleaned, de-duplicated and safe to render:
 * sections/scene NEVER touch the raw PortfolioRenderConfig.
 * Optional = "may be absent". Arrays are always arrays (possibly empty).
 */
export type YearMonth = { year: number; month?: number };

export type DateSpan = {
  start?: YearMonth;
  end?: YearMonth;
  current: boolean;
  /** "Mar 2021 — Present" | "2019 — 2023" | "2021" | "" */
  label: string;
  /** "2 yrs 3 mos" (only when start is known) */
  durationLabel?: string;
  months?: number;
};

export type CinematicLink = {
  kind: "github" | "linkedin" | "resume" | "phone";
  label: string;
  href: string;
};

export type CinematicPerson = {
  username: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  /** User headline, else latest role, else undefined */
  headline?: string;
  headlineSource: "user" | "role" | "none";
  location?: string;
};

export type CinematicAbout = {
  paragraphs: string[];
  /** First sentence – used for big pull-quote / title card */
  lead: string;
  wordCount: number;
};

export type SkillTier = "core" | "working" | "familiar";

export type CinematicSkill = {
  id: string;
  name: string;
  /** 0..1 */
  level: number;
  levelKnown: boolean;
  levelLabel?: string;
  tier: SkillTier;
};

export type CinematicProject = {
  id: string;
  index: number;
  title: string;
  summary?: string;
  url?: string;
  host?: string;
  tech: string[];
  imageUrl?: string;
};

export type CinematicExperience = {
  id: string;
  company: string;
  role: string;
  location?: string;
  span: DateSpan;
  summary?: string;
  highlights: string[];
};

export type CinematicEducation = {
  id: string;
  institution: string;
  degree?: string;
  field?: string;
  /** "BSc · Computer Science" */
  title: string;
  span: DateSpan;
  summary?: string;
};

export type CinematicCertificate = {
  id: string;
  name: string;
  issuer?: string;
  issuedLabel?: string;
  url?: string;
};

export type CinematicContact = {
  links: CinematicLink[];
  location?: string;
  /** true when portfolioId exists -> render form wired to sendContactMessage + trackContactClick(portfolioId) */
  canMessage: boolean;
  username: string;
  portfolioId?: string;
};

export type CinematicStats = {
  projectCount: number;
  skillCount: number;
  coreSkillCount: number;
  companyCount: number;
  institutionCount: number;
  certificateCount: number;
  experienceMonths: number;
  experienceYears: number; // 1 decimal
};

export type CinematicFlags = {
  /** config.animations === false  -> static / reduced-motion experience */
  reducedMotion: boolean;
  isPremium: boolean;
  showWatermark: boolean;
};

export type CinematicPortfolio = {
  person: CinematicPerson;
  about?: CinematicAbout;
  skills: CinematicSkill[];
  projects: CinematicProject[];
  experience: CinematicExperience[];
  education: CinematicEducation[];
  certificates: CinematicCertificate[];
  contact: CinematicContact;
  stats: CinematicStats;
  flags: CinematicFlags;
};
