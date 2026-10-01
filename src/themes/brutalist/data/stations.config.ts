import type { LandmarkKind, StationId, StationMood } from "../schema";
import type { ThemeSectionId } from "@/themes/types";

export type StationMeta = {
  label: string;
  landmark: LandmarkKind;
  mood: StationMood;
  /** journey me is station ki base length */
  baseWeight: number;
  /** har item ke liye extra length (projects jitne zyada, flight utni lambi) */
  perItemWeight: number;
  /** itne items tak hi scene me dikhayenge (baaki total me count hote hain) */
  limit: number;
  /** config.componentSelection ka key (enabled flag check karne ke liye) */
  selectionKey: ThemeSectionId;
};

/** Flight ka fixed order. Missing data wale stations skip ho jayenge. */
export const STATION_ORDER: readonly StationId[] = [
  "hero",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "certificates",
  "contact",
] as const;

export const STATION_META: Record<StationId, StationMeta> = {
  hero: {
    label: "Takeoff",
    landmark: "runway",
    mood: "dawn",
    baseWeight: 1.0,
    perItemWeight: 0,
    limit: 1,
    selectionKey: "hero",
  },
  about: {
    label: "About",
    landmark: "control-tower",
    mood: "morning",
    baseWeight: 1.0,
    perItemWeight: 0,
    limit: 1,
    selectionKey: "about",
  },
  skills: {
    label: "Skills",
    landmark: "sky-islands",
    mood: "noon",
    baseWeight: 1.0,
    perItemWeight: 0.05,
    limit: 24,
    selectionKey: "skills",
  },
  projects: {
    label: "Projects",
    landmark: "ring-gates",
    mood: "noon",
    baseWeight: 0.6,
    perItemWeight: 0.6,
    limit: 9,
    selectionKey: "projects",
  },
  experience: {
    label: "Journey",
    landmark: "beacon-trail",
    mood: "golden",
    baseWeight: 0.6,
    perItemWeight: 0.5,
    limit: 8,
    selectionKey: "experience",
  },
  education: {
    label: "Education",
    landmark: "academy-peak",
    mood: "dusk",
    baseWeight: 0.6,
    perItemWeight: 0.4,
    limit: 5,
    selectionKey: "education",
  },
  certificates: {
    label: "Badges",
    landmark: "balloon-field",
    mood: "dusk",
    baseWeight: 0.6,
    perItemWeight: 0.2,
    limit: 8,
    selectionKey: "certificates",
  },
  contact: {
    label: "Landing",
    landmark: "landing-strip",
    mood: "night",
    baseWeight: 1.0,
    perItemWeight: 0,
    limit: 6,
    selectionKey: "contact",
  },
};

/** 1 scroll "page" = itna journey weight. scrollPages = totalWeight * SCROLL_PAGES_PER_WEIGHT */
export const SCROLL_PAGES_PER_WEIGHT = 0.9;
