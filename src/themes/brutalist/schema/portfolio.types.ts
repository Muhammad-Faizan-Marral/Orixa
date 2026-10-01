import type {
  CinematicLink,
  CinematicStation,
  StationId,
  StatItem,
} from "./station.types";
import type { WorldSettings } from "./world.types";

export type CinematicIdentity = {
  name: string;
  firstName: string;
  initials: string;
  username: string;
  avatarUrl?: string;
  headline?: string;
  location?: string;
};

/** Navbar ki jagah HUD: stations ki list jis par click karke plane wahan jayega. */
export type HudItem = {
  id: StationId;
  label: string;
  center: number;
};

export type FooterData = {
  name: string;
  showWatermark: boolean;
};

export type CinematicJourney = {
  stationCount: number;
  /** scroll height (viewport pages me): zyada content = lambi flight */
  scrollPages: number;
};

export type CinematicSeo = {
  title: string;
  description: string;
  keywords: string[];
  noIndex: boolean;
};

/**
 * Final view-model. Scene aur UI dono sirf isay read karenge,
 * raw PortfolioRenderConfig ko kabhi direct nahi.
 */
export type CinematicModel = {
  identity: CinematicIdentity;
  stations: CinematicStation[];
  hud: HudItem[];
  footer: FooterData;
  stats: StatItem[];
  links: CinematicLink[];
  journey: CinematicJourney;
  world: WorldSettings;
  seo: CinematicSeo;
  isPremium: boolean;
};

export type BuildModelOptions = {
  /** testing / SSR ke liye fixed "now" */
  now?: Date;
  /** experience/education order: "asc" = purana -> naya (flight forward in time) */
  timelineOrder?: "asc" | "desc";
  reducedMotion?: boolean;
};