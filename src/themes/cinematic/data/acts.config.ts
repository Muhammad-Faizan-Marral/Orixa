import type { ActDefinition } from "../schema";
import { pluralize } from "./format";

/**
 * The storyboard. Order here = order in the film.
 * Bookend: the film opens and closes in the same mood (petal-pond).
 */
export const ACT_DEFINITIONS: ActDefinition[] = [
  {
    id: "arrival",
    section: "hero",
    role: "prologue",
    title: "Opening Scene",
    mood: "petal-pond",
    requires: () => true,
    count: () => 1,
    weight: () => 1.2,
    caption: (p) => p.person.location,
  },
  {
    id: "about",
    section: "about",
    role: "chapter",
    title: "Who I Am",
    mood: "butterfly-dusk",
    requires: (p) => !!p.about,
    count: (p) => p.about?.paragraphs.length ?? 0,
    weight: (p) => 1 + Math.min(0.5, ((p.about?.wordCount ?? 0) / 400) * 0.5),
    caption: () => undefined,
  },
  {
    id: "skills",
    section: "skills",
    role: "chapter",
    title: "The Craft",
    mood: "wave-field",
    requires: (p) => p.skills.length > 0,
    count: (p) => p.skills.length,
    weight: (p) => 1 + Math.min(1, p.skills.length * 0.04),
    caption: (p) =>
      p.stats.coreSkillCount
        ? `${pluralize(p.skills.length, "tool")} · ${p.stats.coreSkillCount} core`
        : pluralize(p.skills.length, "tool"),
  },
  {
    id: "projects",
    section: "projects",
    role: "chapter",
    title: "Selected Works",
    mood: "lantern-dust",
    requires: (p) => p.projects.length > 0,
    count: (p) => p.projects.length,
    weight: (p) => 0.6 + p.projects.length * 0.9, // one "frame" per project
    caption: (p) => pluralize(p.projects.length, "project"),
  },
  {
    id: "experience",
    section: "experience",
    role: "chapter",
    title: "The Road So Far",
    mood: "wave-field",
    requires: (p) => p.experience.length > 0,
    count: (p) => p.experience.length,
    weight: (p) => 0.8 + p.experience.length * 0.6,
    caption: (p) => {
      const places = pluralize(p.stats.companyCount, "place");
      return p.stats.experienceYears >= 1 ? `${p.stats.experienceYears} years · ${places}` : places;
    },
  },
  {
    id: "education",
    section: "education",
    role: "chapter",
    title: "Where It Began",
    mood: "petal-pond",
    requires: (p) => p.education.length > 0,
    count: (p) => p.education.length,
    weight: (p) => 0.7 + p.education.length * 0.4,
    caption: (p) => pluralize(p.education.length, "chapter"),
  },
  {
    id: "certificates",
    section: "certificates",
    role: "chapter",
    title: "Keepsakes",
    mood: "butterfly-dusk",
    requires: (p) => p.certificates.length > 0,
    count: (p) => p.certificates.length,
    weight: (p) => 0.7 + Math.min(1, p.certificates.length * 0.2),
    caption: (p) => pluralize(p.certificates.length, "credential"),
  },
  {
    id: "contact",
    section: "contact",
    role: "epilogue",
    title: "Until Next Time",
    mood: "petal-pond",
    requires: (p) => p.contact.canMessage || p.contact.links.length > 0, // same rule as ContactDefault's `return null`
    count: (p) => p.contact.links.length,
    weight: () => 1.1,
    caption: () => undefined,
  },
];
