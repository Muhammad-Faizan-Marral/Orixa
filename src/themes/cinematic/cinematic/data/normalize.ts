import type { PortfolioRenderConfig, PublicProfileMeta } from "@/portfolio-renderer/types";
import type {
  CinematicAbout, CinematicCertificate, CinematicContact, CinematicEducation,
  CinematicExperience, CinematicPerson, CinematicProject, CinematicSkill, SkillTier,
} from "../schema";
import {
  buildSpan, compareSpansDesc, firstSentence, formatYearMonth, initialsOf, parseLevel,
  parseYearMonth, slug, splitLines, splitParagraphs,
} from "./format";

type Config = PortfolioRenderConfig;
type Profile = PublicProfileMeta & { isPremium?: boolean };

/* ---------- primitives ---------- */

/** trim + collapse; "" / null / undefined -> undefined */
export function clean(v?: string | null): string | undefined {
  const s = v?.replace(/\s+/g, " ").trim();
  return s ? s : undefined;
}

/** Only http(s) (bare domains get https://). Optionally root-relative. Everything else is dropped. */
export function safeUrl(raw?: string | null, opts: { allowRelative?: boolean } = {}): string | undefined {
  const s = raw?.trim();
  if (!s) return undefined;
  if (opts.allowRelative && s.startsWith("/") && !s.startsWith("//")) return s;
  const withProto = /^[a-z][a-z0-9+.-]*:/i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(withProto);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function hostOf(url?: string): string | undefined {
  if (!url) return undefined;
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return undefined; }
}

const uniqBy = <T,>(items: T[], key: (t: T) => string) => {
  const seen = new Set<string>();
  return items.filter((i) => {
    const k = key(i).toLowerCase();
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

const idOf = (id: string | undefined, prefix: string, label: string, i: number) =>
  clean(id) ?? `${prefix}-${slug(label) || "item"}-${i}`;

/* ---------- person / about ---------- */

export function normalizePerson(config: Config, profile: Profile, latestRole?: string): CinematicPerson {
  const name = clean(config.name) ?? clean(profile.fullName) ?? profile.username;
  const userHeadline = clean(config.headline);
  return {
    username: profile.username,
    name,
    initials: initialsOf(name),
    avatarUrl: safeUrl(config.avatarUrl, { allowRelative: true }) ?? safeUrl(profile.avatarUrl, { allowRelative: true }),
    headline: userHeadline ?? latestRole,
    headlineSource: userHeadline ? "user" : latestRole ? "role" : "none",
    location: clean(config.location),
  };
}

export function normalizeAbout(config: Config): CinematicAbout | undefined {
  const text = config.about?.trim();
  if (!text) return undefined;
  const paragraphs = splitParagraphs(text);
  if (!paragraphs.length) return undefined;
  return {
    paragraphs,
    lead: firstSentence(paragraphs[0]),
    wordCount: paragraphs.join(" ").split(/\s+/).length,
  };
}

/* ---------- lists ---------- */

const tierOf = (level: number): SkillTier => (level >= 0.8 ? "core" : level >= 0.55 ? "working" : "familiar");
const UNKNOWN_LEVEL = 0.6;

export function normalizeSkills(config: Config): CinematicSkill[] {
  const list = (config.skills ?? [])
    .map((s, i) : CinematicSkill | null => {
      const name = clean(s.name);
      if (!name) return null;
      const parsed = parseLevel(s.level);
      const level = parsed ?? UNKNOWN_LEVEL;
      return {
        id: idOf(s.id, "skill", name, i),
        name,
        level,
        levelKnown: parsed !== undefined,
        levelLabel: clean(s.level),
        tier: tierOf(level),
      };
    })
    .filter((s): s is CinematicSkill => s !== null);
  return uniqBy(list, (s) => s.name).sort((a, b) => b.level - a.level || a.name.localeCompare(b.name));
}

export function normalizeProjects(config: Config): CinematicProject[] {
  const list = (config.projects ?? [])
    .map((p, i) : CinematicProject | null => {
      const title = clean(p.title);
      if (!title) return null;
      const url = safeUrl(p.url);
      return {
        id: idOf(p.id, "project", title, i),
        index: 0,
        title,
        summary: clean(p.description),
        url,
        host: hostOf(url),
        tech: uniqBy((p.technologies ?? []).map((t) => clean(t) ?? ""), (t) => t),
        imageUrl: safeUrl(p.imageUrl, { allowRelative: true }),
      };
    })
    .filter((p): p is CinematicProject => p !== null);
  return uniqBy(list, (p) => p.id).map((p, index) => ({ ...p, index }));
}

export function normalizeExperience(config: Config, now: Date): CinematicExperience[] {
  const list = (config.experience ?? [])
    .map((e, i) : CinematicExperience | null => {
      const company = clean(e.company);
      const role = clean(e.role);
      if (!company && !role) return null;
      const lines = e.description ? splitLines(e.description) : [];
      const asBullets = lines.length > 1;
      return {
        id: idOf(e.id, "exp", `${company ?? ""}-${role ?? ""}`, i),
        company: company ?? "",
        role: role ?? "",
        location: clean(e.location),
        span: buildSpan(e.startDate, e.endDate, e.current, now),
        summary: asBullets ? undefined : clean(e.description),
        highlights: asBullets ? lines : [],
      };
    })
    .filter((e): e is CinematicExperience => e !== null);
  return list.sort((a, b) => compareSpansDesc(a.span, b.span));
}

export function normalizeEducation(config: Config, now: Date): CinematicEducation[] {
  const list = (config.education ?? [])
    .map((e, i) : CinematicEducation | null => {
      const institution = clean(e.institution);
      if (!institution) return null;
      const degree = clean(e.degree);
      const field = clean(e.field);
      return {
        id: idOf(e.id, "edu", institution, i),
        institution,
        degree,
        field,
        title: [degree, field].filter(Boolean).join(" · "),
        span: buildSpan(e.startDate, e.endDate, false, now),
        summary: clean(e.description),
      };
    })
    .filter((e): e is CinematicEducation => e !== null);
  return list.sort((a, b) => compareSpansDesc(a.span, b.span));
}

export function normalizeCertificates(config: Config): CinematicCertificate[] {
  const list = (config.certificates ?? [])
    .map((c, i) : CinematicCertificate | null => {
      const name = clean(c.name);
      if (!name) return null;
      return {
        id: idOf(c.id, "cert", name, i),
        name,
        issuer: clean(c.issuer),
        issuedLabel: formatYearMonth(parseYearMonth(c.issueDate)) || clean(c.issueDate),
        url: safeUrl(c.credentialUrl),
      };
    })
    .filter((c): c is CinematicCertificate => c !== null);
  return uniqBy(list, (c) => `${c.name}|${c.issuer ?? ""}`);
}

export function normalizeContact(config: Config, profile: Profile): CinematicContact {
  const links: CinematicContact["links"] = [];
  const github = safeUrl(config.githubUrl);
  const linkedin = safeUrl(config.linkedinUrl);
  const resume = safeUrl(config.resumeUrl, { allowRelative: true });
  const phone = clean(config.phone);
  if (github) links.push({ kind: "github", label: "GitHub", href: github });
  if (linkedin) links.push({ kind: "linkedin", label: "LinkedIn", href: linkedin });
  if (resume) links.push({ kind: "resume", label: "Résumé", href: resume });
  if (phone) links.push({ kind: "phone", label: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` });
  return {
    links,
    location: clean(config.location),
    // mirrors existing ContactDefault: form exists only when portfolioId exists
    canMessage: !!config.portfolioId,
    username: profile.username,
    portfolioId: config.portfolioId,
  };
}
