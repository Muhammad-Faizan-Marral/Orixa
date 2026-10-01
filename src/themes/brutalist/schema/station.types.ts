/**
 * Station = ek "jagah" jahan flight ke dauran plane rukta / guzarta hai.
 * Har station portfolio ke ek section ko represent karta hai.
 */

export type StationId =
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "certificates"
  | "contact";

/** 3D world me is station ka landmark (scene me kya banega). */
export type LandmarkKind =
  | "runway" //          hero
  | "control-tower" //   about
  | "sky-islands" //     skills
  | "ring-gates" //      projects
  | "beacon-trail" //    experience
  | "academy-peak" //    education
  | "balloon-field" //   certificates
  | "landing-strip"; //  contact

/** Din ka waqt / atmosphere. Journey dawn se night tak jayegi. */
export type StationMood =
  | "dawn"
  | "morning"
  | "noon"
  | "golden"
  | "dusk"
  | "night";

/** Scroll/flight progress ki range (0..1). */
export type ProgressRange = {
  start: number;
  end: number;
  center: number;
};

/* ------------------------------ Station data ------------------------------ */

export type StatItem = {
  key: "years" | "projects" | "skills" | "companies" | "certificates";
  value: number;
  label: string;
};

export type CinematicLink = {
  kind: "github" | "linkedin" | "resume" | "phone" | "project";
  label: string;
  href: string;
  external: boolean;
};

export type HeroData = {
  name: string;
  firstName: string;
  initials: string;
  headline?: string;
  /** headline ko "|", "·", "•" par tod kar (typing / rotating text ke liye) */
  roleWords: string[];
  avatarUrl?: string;
  location?: string;
  primaryCta?: CinematicLink;
};

export type AboutData = {
  text: string;
  paragraphs: string[];
  stats: StatItem[];
};

export type SkillTier = "core" | "strong" | "familiar";

export type SkillNode = {
  id: string;
  name: string;
  /** 0..1, unknown ho to null */
  level: number | null;
  tier: SkillTier;
  /** deterministic 0..1 seed: island/orbit position ke liye (SSR safe, Math.random nahi) */
  seed: number;
};

export type SkillsData = {
  nodes: SkillNode[];
  total: number;
  hasLevels: boolean;
};

export type ProjectItem = {
  id: string;
  slug: string;
  index: number;
  title: string;
  description?: string;
  url?: string;
  technologies: string[];
  imageUrl?: string;
  /** gate ka rang */
  accent: string;
  featured: boolean;
};

export type ProjectsData = {
  items: ProjectItem[];
  total: number;
};

export type TimelineItem = {
  id: string;
  index: number;
  title: string; //          role / degree
  organization: string; //   company / institution
  subtitle?: string; //      location / field
  description?: string;
  startLabel?: string;
  endLabel?: string; //      "Present" bhi ho sakta hai
  rangeLabel?: string; //    "Mar 2022 — Present"
  durationMonths?: number;
  current: boolean;
  startTs?: number;
};

export type ExperienceData = {
  items: TimelineItem[];
  total: number;
};

export type EducationData = {
  items: TimelineItem[];
  total: number;
};

export type CertificateItem = {
  id: string;
  index: number;
  name: string;
  issuer?: string;
  dateLabel?: string;
  url?: string;
  accent: string;
  seed: number;
};

export type CertificatesData = {
  items: CertificateItem[];
  total: number;
};

export type ContactData = {
  links: CinematicLink[];
  phone?: string;
  location?: string;
  resumeUrl?: string;
};

/* --------------------------------- Station -------------------------------- */

type StationBase<Id extends StationId, Data> = {
  id: Id;
  /** journey me order (0-based) */
  index: number;
  label: string;
  landmark: LandmarkKind;
  mood: StationMood;
  range: ProgressRange;
  data: Data;
};

export type HeroStation = StationBase<"hero", HeroData>;
export type AboutStation = StationBase<"about", AboutData>;
export type SkillsStation = StationBase<"skills", SkillsData>;
export type ProjectsStation = StationBase<"projects", ProjectsData>;
export type ExperienceStation = StationBase<"experience", ExperienceData>;
export type EducationStation = StationBase<"education", EducationData>;
export type CertificatesStation = StationBase<"certificates", CertificatesData>;
export type ContactStation = StationBase<"contact", ContactData>;

export type CinematicStation =
  | HeroStation
  | AboutStation
  | SkillsStation
  | ProjectsStation
  | ExperienceStation
  | EducationStation
  | CertificatesStation
  | ContactStation;

export type StationOf<Id extends StationId> = Extract<
  CinematicStation,
  { id: Id }
>;
