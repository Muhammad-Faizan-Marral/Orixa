/**
 * Har section ka builder: raw config -> station data.
 * Rule: data na ho to `null` return karo, station journey me add hi nahi hoga.
 */
import type {
  PortfolioRenderConfig,
  PublicProfileMeta,
} from "@/portfolio-renderer/types";
import type {
  AboutData,
  CertificateItem,
  CertificatesData,
  CinematicLink,
  ContactData,
  EducationData,
  ExperienceData,
  HeroData,
  ProjectItem,
  ProjectsData,
  SkillNode,
  SkillsData,
  SkillTier,
  StatItem,
  TimelineItem,
} from "../schema";
import { ACCENT_CYCLE } from "./world.config";
import { STATION_META } from "./stations.config";
import {
  clean,
  cleanList,
  formatDuration,
  formatMonthYear,
  initialsOf,
  monthsBetween,
  parseDate,
  safeUrl,
  seedOf,
  slugify,
  splitParagraphs,
  splitRoleWords,
} from "./format";

type Cfg = PortfolioRenderConfig;
type Profile = PublicProfileMeta & { isPremium?: boolean };

const accent = (i: number) => ACCENT_CYCLE[i % ACCENT_CYCLE.length];

function cap<T>(list: T[], limit: number) {
  return { items: list.slice(0, limit), total: list.length };
}

/* --------------------------------- Identity -------------------------------- */

export function resolveName(cfg: Cfg, profile: Profile): string {
  return clean(cfg.name) ?? clean(profile.fullName) ?? profile.username;
}

/* ---------------------------------- Links ---------------------------------- */

export function buildLinks(cfg: Cfg): CinematicLink[] {
  const links: CinematicLink[] = [];
  const github = safeUrl(cfg.githubUrl);
  const linkedin = safeUrl(cfg.linkedinUrl);
  const resume = safeUrl(cfg.resumeUrl);
  const phone = clean(cfg.phone);

  if (github)
    links.push({
      kind: "github",
      label: "GitHub",
      href: github,
      external: true,
    });
  if (linkedin)
    links.push({
      kind: "linkedin",
      label: "LinkedIn",
      href: linkedin,
      external: true,
    });
  if (resume)
    links.push({
      kind: "resume",
      label: "Resume",
      href: resume,
      external: true,
    });
  if (phone)
    links.push({
      kind: "phone",
      label: phone,
      href: `tel:${phone.replace(/[^\d+]/g, "")}`,
      external: false,
    });
  return links;
}

/* ----------------------------------- Hero ---------------------------------- */

export function buildHero(
  cfg: Cfg,
  profile: Profile,
  links: CinematicLink[],
): HeroData {
  const name = resolveName(cfg, profile);
  const headline = clean(cfg.headline);
  const primaryCta =
    links.find((l) => l.kind === "resume") ??
    links.find((l) => l.kind === "github") ??
    links[0];
  return {
    name,
    firstName: name.split(/\s+/)[0] ?? name,
    initials: initialsOf(name),
    headline,
    roleWords: splitRoleWords(headline),
    avatarUrl: clean(cfg.avatarUrl) ?? clean(profile.avatarUrl),
    location: clean(cfg.location),
    primaryCta,
  };
}

/* ----------------------------------- About --------------------------------- */

export function buildAbout(cfg: Cfg, stats: StatItem[]): AboutData | null {
  const text = clean(cfg.about);
  if (!text) return null;
  return { text, paragraphs: splitParagraphs(text), stats };
}

/* ---------------------------------- Skills --------------------------------- */

const LEVEL_WORDS: Array<[RegExp, number]> = [
  [/expert|master|native|guru/i, 0.95],
  [/advanced|senior|proficient|fluent|strong/i, 0.8],
  [/intermediate|mid|working|good|comfortable/i, 0.6],
  [/beginner|basic|junior|learning|novice|familiar/i, 0.35],
];

/** "Expert", "80", "80%", "4/5", "4" -> 0..1. Samajh na aaye to null. */
export function parseSkillLevel(raw: string | undefined): number | null {
  const t = clean(raw);
  if (!t) return null;
  const frac = t.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (frac && Number(frac[2]) > 0)
    return clamp01(Number(frac[1]) / Number(frac[2]));
  const num = t.match(/^(\d+(?:\.\d+)?)\s*(%?)$/);
  if (num) {
    const n = Number(num[1]);
    if (num[2] === "%" || n > 10) return clamp01(n / 100);
    return clamp01(n <= 5 ? n / 5 : n / 10);
  }
  for (const [re, v] of LEVEL_WORDS) if (re.test(t)) return v;
  return null;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function buildSkills(cfg: Cfg): SkillsData | null {
  const seen = new Set<string>();
  const raw = (cfg.skills ?? []).filter((s) => {
    const name = clean(s?.name);
    if (!name) return false;
    const key = name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (!raw.length) return null;

  const { items, total } = cap(raw, STATION_META.skills.limit);
  const levels = items.map((s) => parseSkillLevel(s.level));
  const hasLevels = levels.some((l) => l !== null);

  const nodes: SkillNode[] = items.map((s, i) => {
    const name = clean(s.name)!;
    const level = levels[i];
    let tier: SkillTier;
    if (level !== null)
      tier = level >= 0.8 ? "core" : level >= 0.55 ? "strong" : "familiar";
    else
      tier =
        i < items.length / 3
          ? "core"
          : i < (items.length * 2) / 3
            ? "strong"
            : "familiar";
    return {
      id: s.id ?? `skill-${slugify(name)}`,
      name,
      level,
      tier,
      seed: seedOf(name),
    };
  });
  return { nodes, total, hasLevels };
}

/* --------------------------------- Projects -------------------------------- */

export function buildProjects(cfg: Cfg): ProjectsData | null {
  const raw = (cfg.projects ?? []).filter((p) => clean(p?.title));
  if (!raw.length) return null;
  const { items, total } = cap(raw, STATION_META.projects.limit);
  const mapped: ProjectItem[] = items.map((p, i) => {
    const title = clean(p.title)!;
    return {
      id: p.id ?? `project-${i}`,
      slug: slugify(title),
      index: i,
      title,
      description: clean(p.description),
      url: safeUrl(p.url),
      technologies: cleanList(p.technologies).slice(0, 8),
      imageUrl: safeUrl(p.imageUrl),
      accent: accent(i),
      featured: i < 3,
    };
  });
  return { items: mapped, total };
}

/* ------------------------- Experience / Education -------------------------- */

type TimelineOpts = { now: Date; order: "asc" | "desc" };

function sortTimeline(
  list: TimelineItem[],
  order: "asc" | "desc",
): TimelineItem[] {
  const dir = order === "asc" ? 1 : -1;
  return [...list]
    .sort((a, b) => ((a.startTs ?? 0) - (b.startTs ?? 0)) * dir)
    .map((it, i) => ({ ...it, index: i }));
}

function rangeOf(
  start: Date | null,
  end: Date | null,
  current: boolean,
  now: Date,
) {
  const startLabel = start ? formatMonthYear(start) : undefined;
  const endLabel = current ? "Present" : end ? formatMonthYear(end) : undefined;
  const rangeLabel =
    startLabel && endLabel
      ? `${startLabel} — ${endLabel}`
      : (startLabel ?? endLabel);
  const durationMonths = start
    ? monthsBetween(start, current || !end ? now : end)
    : undefined;
  return { startLabel, endLabel, rangeLabel, durationMonths };
}

export function buildExperience(
  cfg: Cfg,
  { now, order }: TimelineOpts,
): ExperienceData | null {
  const raw = (cfg.experience ?? []).filter(
    (e) => clean(e?.company) || clean(e?.role),
  );
  if (!raw.length) return null;

  const mapped: TimelineItem[] = raw.map((e, i) => {
    const start = parseDate(e.startDate);
    const end = parseDate(e.endDate);
    const current = Boolean(e.current) || (!!start && !end);
    return {
      id: e.id ?? `experience-${i}`,
      index: i,
      title: clean(e.role) ?? clean(e.company)!,
      organization: clean(e.company) ?? clean(e.role)!,
      subtitle: clean(e.location),
      description: clean(e.description),
      ...rangeOf(start, end, current, now),
      current,
      startTs: start?.getTime(),
    };
  });
  const sorted = sortTimeline(mapped, order);
  // limit: asc me naye wale rakhne hain, isliye cap se pehle order ke hisaab se kaato
  const limit = STATION_META.experience.limit;
  const items = order === "asc" ? sorted.slice(-limit) : sorted.slice(0, limit);
  return {
    items: items.map((it, i) => ({ ...it, index: i })),
    total: sorted.length,
  };
}

export function buildEducation(
  cfg: Cfg,
  { now, order }: TimelineOpts,
): EducationData | null {
  const raw = (cfg.education ?? []).filter((e) => clean(e?.institution));
  if (!raw.length) return null;

  const mapped: TimelineItem[] = raw.map((e, i) => {
    const start = parseDate(e.startDate);
    const end = parseDate(e.endDate);
    const current = !!start && !end;
    const field = [clean(e.degree), clean(e.field)].filter(Boolean);
    return {
      id: e.id ?? `education-${i}`,
      index: i,
      title: field[0] ?? clean(e.institution)!,
      organization: clean(e.institution)!,
      subtitle: field[1],
      description: clean(e.description),
      ...rangeOf(start, end, current, now),
      current,
      startTs: start?.getTime(),
    };
  });
  const sorted = sortTimeline(mapped, order);
  const limit = STATION_META.education.limit;
  const items = order === "asc" ? sorted.slice(-limit) : sorted.slice(0, limit);
  return {
    items: items.map((it, i) => ({ ...it, index: i })),
    total: sorted.length,
  };
}

/* ------------------------------- Certificates ------------------------------ */

export function buildCertificates(cfg: Cfg): CertificatesData | null {
  const raw = (cfg.certificates ?? []).filter((c) => clean(c?.name));
  if (!raw.length) return null;
  const { items, total } = cap(raw, STATION_META.certificates.limit);
  const mapped: CertificateItem[] = items.map((c, i) => {
    const name = clean(c.name)!;
    const d = parseDate(c.issueDate);
    return {
      id: c.id ?? `certificate-${i}`,
      index: i,
      name,
      issuer: clean(c.issuer),
      dateLabel: d ? formatMonthYear(d) : clean(c.issueDate),
      url: safeUrl(c.credentialUrl),
      accent: accent(i + 2),
      seed: seedOf(name),
    };
  });
  return { items: mapped, total };
}

/* ---------------------------------- Contact -------------------------------- */

export function buildContact(
  cfg: Cfg,
  links: CinematicLink[],
): ContactData | null {
  const phone = clean(cfg.phone);
  const location = clean(cfg.location);
  const resumeUrl = safeUrl(cfg.resumeUrl);
  if (!links.length && !location) return null;
  return { links, phone, location, resumeUrl };
}

/* ----------------------------------- Stats --------------------------------- */

export function buildStats(cfg: Cfg, now: Date): StatItem[] {
  const stats: StatItem[] = [];

  const starts = (cfg.experience ?? [])
    .map((e) => parseDate(e.startDate))
    .filter((d): d is Date => d !== null);
  if (starts.length) {
    const earliest = new Date(Math.min(...starts.map((d) => d.getTime())));
    const years = Math.floor(monthsBetween(earliest, now) / 12);
    if (years >= 1)
      stats.push({ key: "years", value: years, label: "Years experience" });
  }

  const projects = (cfg.projects ?? []).filter((p) => clean(p?.title)).length;
  if (projects)
    stats.push({ key: "projects", value: projects, label: "Projects" });

  const skills = new Set(
    (cfg.skills ?? [])
      .map((s) => clean(s?.name)?.toLowerCase())
      .filter(Boolean),
  ).size;
  if (skills) stats.push({ key: "skills", value: skills, label: "Skills" });

  const companies = new Set(
    (cfg.experience ?? [])
      .map((e) => clean(e?.company)?.toLowerCase())
      .filter(Boolean),
  ).size;
  if (companies)
    stats.push({ key: "companies", value: companies, label: "Companies" });

  const certs = (cfg.certificates ?? []).filter((c) => clean(c?.name)).length;
  if (certs)
    stats.push({ key: "certificates", value: certs, label: "Certificates" });

  return stats;
}

// re-export for normalize.ts
export { formatDuration };
