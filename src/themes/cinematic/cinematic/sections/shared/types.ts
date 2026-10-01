import type { Act, CinematicPortfolio } from "../../schema";

/** Every act component receives the clean view-model + its own act (label, title, caption, range). */
export type SectionProps = {
  portfolio: CinematicPortfolio;
  act: Act;
};
