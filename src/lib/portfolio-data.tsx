/**
 * portfolio-data.ts
 * Shared, typed helpers for all portfolio section components.
 * Import from this file — never redefine these helpers inline.
 */

import { PortfolioRenderConfig, RendererCertificate, RendererEducation, RendererExperience, RendererProject, RendererSkill } from "@/portfolio-renderer/types";

// import type {
//   PortfolioRenderConfig,
//   RendererProject,
//   RendererExperience,
//   RendererSkill,
//   RendererEducation,
//   RendererCertificate,
// } from "@/themes/types";

// ---------------------------------------------------------------------------
// Primitive cleaners
// ---------------------------------------------------------------------------

/** Returns a trimmed string, or null if absent / empty after trimming. */
export function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  return t.length > 0 ? t : null;
}

/** Returns the string only if it is a valid http(s) URL, else null. */
export function cleanUrl(value: unknown): string | null {
  const s = clean(value);
  if (!s) return null;
  try {
    const url = new URL(s);
    return url.protocol === "http:" || url.protocol === "https:" ? s : null;
  } catch {
    return null;
  }
}

/**
 * Returns the string only if it is a valid http(s) URL or a data:image/ URI.
 * Both are acceptable sources for next/image (with unoptimized for data: URIs).
 */
export function cleanImage(value: unknown): string | null {
  const s = clean(value);
  if (!s) return null;
  if (s.startsWith("data:image/")) return s;
  return cleanUrl(s);
}

/**
 * Returns a clean array, filtering out items that lack the given required key.
 * Falls back to [] for anything that is not an array.
 */
export function cleanList<T extends Record<string, unknown>>(
  array: unknown,
  requiredKey: keyof T
): T[] {
  if (!Array.isArray(array)) return [];
  return array.filter(
    (item): item is T =>
      item !== null &&
      typeof item === "object" &&
      clean((item as Record<string, unknown>)[requiredKey as string]) !== null
  );
}

// ---------------------------------------------------------------------------
// Date formatting (rule G)
// ---------------------------------------------------------------------------

/**
 * Formats a raw date string.
 * - "YYYY-MM" → "Mar 2022"
 * - "YYYY"    → "2022"
 * - anything else → returned as-is
 */
export function formatDate(value: unknown): string | null {
  const s = clean(value);
  if (!s) return null;

  // YYYY-MM
  const ymMatch = s.match(/^(\d{4})-(\d{2})$/);
  if (ymMatch) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthIdx = parseInt(ymMatch[2], 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${months[monthIdx]} ${ymMatch[1]}`;
    }
  }

  // YYYY only
  if (/^\d{4}$/.test(s)) return s;

  // free text — return as-is
  return s;
}

/**
 * Builds a date range string, e.g. "Mar 2022 – Present" or "2019 – 2021".
 * Shows nothing if both dates are absent.
 */
export function formatDateRange(
  startDate: unknown,
  endDate: unknown,
  current?: boolean
): string | null {
  const start = formatDate(startDate);
  const end = current || (!clean(endDate) && start) ? "Present" : formatDate(endDate);

  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  if (end && end !== "Present") return end;
  return null;
}

// ---------------------------------------------------------------------------
// Initials helper
// ---------------------------------------------------------------------------

/** Derives 1–2 initials from a name string. */
export function getInitials(name: unknown): string {
  const s = clean(name);
  if (!s) return "?";
  const words = s.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// ---------------------------------------------------------------------------
// View-model types
// ---------------------------------------------------------------------------

export interface ProjectView {
  key: string;
  title: string;
  description: string | null;
  url: string | null;
  technologies: string[];
  imageUrl: string | null;
}

export interface ExperienceView {
  key: string;
  company: string;
  role: string;
  location: string | null;
  dateRange: string | null;
  description: string | null;
}

export interface SkillView {
  key: string;
  name: string;
  level: string | null;
}

export interface EducationView {
  key: string;
  institution: string;
  degree: string | null;
  field: string | null;
  dateRange: string | null;
  description: string | null;
}

export interface CertificateView {
  key: string;
  name: string;
  issuer: string | null;
  issueDate: string | null;
  credentialUrl: string | null;
}

// ---------------------------------------------------------------------------
// View-model builders
// ---------------------------------------------------------------------------

export function toProjectView(p: RendererProject, index: number): ProjectView {
  return {
    key: p.id ?? `${p.title}-${index}`,
    title: clean(p.title) ?? "Untitled", // cleanList guarantees title exists
    description: clean(p.description),
    url: cleanUrl(p.url),
    technologies: Array.isArray(p.technologies)
      ? p.technologies.map((t) => clean(t)).filter((t): t is string => t !== null)
      : [],
    imageUrl: cleanImage(p.imageUrl),
  };
}

export function toExperienceView(
  e: RendererExperience,
  index: number
): ExperienceView {
  return {
    key: e.id ?? `${e.company}-${index}`,
    company: clean(e.company) ?? "Unknown",
    role: clean(e.role) ?? "Unknown",
    location: clean(e.location),
    dateRange: formatDateRange(e.startDate, e.endDate, e.current),
    description: clean(e.description),
  };
}

export function toSkillView(s: RendererSkill, index: number): SkillView {
  return {
    key: s.id ?? `${s.name}-${index}`,
    name: clean(s.name) ?? "Unknown",
    level: clean(s.level),
  };
}

export function toEducationView(
  e: RendererEducation,
  index: number
): EducationView {
  return {
    key: e.id ?? `${e.institution}-${index}`,
    institution: clean(e.institution) ?? "Unknown",
    degree: clean(e.degree),
    field: clean(e.field),
    dateRange: formatDateRange(e.startDate, e.endDate),
    description: clean(e.description),
  };
}

export function toCertificateView(
  c: RendererCertificate,
  index: number
): CertificateView {
  return {
    key: c.id ?? `${c.name}-${index}`,
    name: clean(c.name) ?? "Unknown",
    issuer: clean(c.issuer),
    issueDate: formatDate(c.issueDate),
    credentialUrl: cleanUrl(c.credentialUrl),
  };
}

// ---------------------------------------------------------------------------
// Section-enabled guard
// ---------------------------------------------------------------------------

/** Returns false if componentSelection explicitly disables the section. */
export function isSectionEnabled(
  config: PortfolioRenderConfig,
  section: string
): boolean {
  const sel = config.componentSelection?.[section as keyof typeof config.componentSelection];
  if (sel && typeof sel === "object" && "enabled" in sel) {
    return (sel as { enabled: boolean }).enabled !== false;
  }
  return true;
}