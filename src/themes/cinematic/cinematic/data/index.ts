import type { ThemeSectionProps } from "../../types";
import type { CinematicPortfolio, Journey } from "../schema";
import { deriveJourney, deriveLatestRole, deriveStats } from "./derive";
import {
  normalizeAbout, normalizeCertificates, normalizeContact, normalizeEducation,
  normalizeExperience, normalizePerson, normalizeProjects, normalizeSkills,
} from "./normalize";

export * from "./acts.config";
export * from "./mood.config";
export * from "./format";

export type CinematicModel = { portfolio: CinematicPortfolio; journey: Journey };

/**
 * Single entry point: raw renderer config -> safe view-model + act timeline.
 * Pass `now` from the server if you ever see hydration drift on "duration" labels.
 */
export function buildCinematicModel(
  { config, profile }: ThemeSectionProps,
  opts: { now?: Date } = {},
): CinematicModel {
  const now = opts.now ?? new Date();

  const experience = normalizeExperience(config, now);
  const lists = {
    skills: normalizeSkills(config),
    projects: normalizeProjects(config),
    experience,
    education: normalizeEducation(config, now),
    certificates: normalizeCertificates(config),
  };

  const portfolio: CinematicPortfolio = {
    person: normalizePerson(config, profile, deriveLatestRole(experience)),
    about: normalizeAbout(config),
    ...lists,
    contact: normalizeContact(config, profile),
    stats: deriveStats(lists, now),
    flags: {
      reducedMotion: config.animations === false,
      isPremium: !!profile.isPremium,
      showWatermark: !profile.isPremium,
    },
  };

  return { portfolio, journey: deriveJourney(portfolio) };
}
