import type { ThemeSectionId } from "../../types";
import type { CinematicPortfolio } from "./portfolio.types";
import type { MoodId } from "./world.types";

/**
 * An "act" is one scene of the film. Each act is backed by one renderer
 * section (so selection / enabled flags still map 1:1), but acts only exist
 * when the user actually has data for them – the film simply gets shorter.
 */
export type ActId =
  | "arrival"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "certificates"
  | "contact";

export type ActRole = "prologue" | "chapter" | "epilogue";

/** Static definition (config). */
export type ActDefinition = {
  id: ActId;
  section: ThemeSectionId;
  role: ActRole;
  /** Title-card text, e.g. "The Craft" */
  title: string;
  mood: MoodId;
  requires: (p: CinematicPortfolio) => boolean;
  count: (p: CinematicPortfolio) => number;
  /** Relative scroll length. 1 = one viewport (100vh) */
  weight: (p: CinematicPortfolio) => number;
  /** Small line under the title card, derived from real data */
  caption: (p: CinematicPortfolio) => string | undefined;
};

/** Resolved act (runtime). */
export type Act = {
  id: ActId;
  section: ThemeSectionId;
  index: number;
  /** "Prologue" | "Chapter II" | "Epilogue" */
  label: string;
  title: string;
  caption?: string;
  mood: MoodId;
  itemCount: number;
  weight: number;
  scrollVh: number;
  /** Normalised 0..1 position of this act on the global scroll timeline */
  range: { start: number; end: number };
};

export type Journey = {
  acts: Act[];
  totalScrollVh: number;
};
