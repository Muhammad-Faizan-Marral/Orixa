import type { Act, CinematicPortfolio, CinematicStats, Journey } from "../schema";
import { ACT_DEFINITIONS } from "./acts.config";
import { toRoman, totalMonths } from "./format";

type Lists = Pick<CinematicPortfolio, "skills" | "projects" | "experience" | "education" | "certificates">;

export function deriveStats(l: Lists, now: Date): CinematicStats {
  const months = totalMonths(l.experience.map((e) => e.span), now);
  const companies = new Set(l.experience.map((e) => e.company.toLowerCase()).filter(Boolean));
  return {
    projectCount: l.projects.length,
    skillCount: l.skills.length,
    coreSkillCount: l.skills.filter((s) => s.tier === "core").length,
    companyCount: companies.size,
    institutionCount: new Set(l.education.map((e) => e.institution.toLowerCase())).size,
    certificateCount: l.certificates.length,
    experienceMonths: months,
    experienceYears: Math.round((months / 12) * 10) / 10,
  };
}

/** Latest role used as headline fallback when the user has none. */
export function deriveLatestRole(experience: CinematicPortfolio["experience"]): string | undefined {
  const e = experience[0];
  if (!e?.role) return undefined;
  return e.company ? `${e.role} @ ${e.company}` : e.role;
}

/**
 * Storyboard -> timeline. Acts without data are dropped, scroll length is
 * distributed by weight, chapter numerals are re-counted so there are no gaps.
 */
export function deriveJourney(p: CinematicPortfolio): Journey {
  const defs = ACT_DEFINITIONS.filter((d) => d.requires(p));
  const weights = defs.map((d) => d.weight(p));
  const total = weights.reduce((a, b) => a + b, 0) || 1;

  let cursor = 0;
  let chapter = 0;
  const acts: Act[] = defs.map((d, index) => {
    const w = weights[index];
    const start = cursor / total;
    cursor += w;
    return {
      id: d.id,
      section: d.section,
      index,
      label: d.role === "prologue" ? "Prologue" : d.role === "epilogue" ? "Epilogue" : `Chapter ${toRoman(++chapter)}`,
      title: d.title,
      caption: d.caption(p),
      mood: d.mood,
      itemCount: d.count(p),
      weight: w,
      scrollVh: Math.round(w * 100),
      range: { start, end: cursor / total },
    };
  });

  return { acts, totalScrollVh: acts.reduce((s, a) => s + a.scrollVh, 0) };
}
