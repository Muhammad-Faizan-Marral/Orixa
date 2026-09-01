import type { RendererExperience } from "../../types";
import { ExperienceCards } from "./ExperienceCards";
import { ExperienceCompact } from "./ExperienceCompact";
import { ExperienceTimeline } from "./ExperienceTimeline";

export function ExperienceSection({
  variant,
  experience,
}: {
  variant?: string;
  experience: RendererExperience[];
}) {
  switch (variant) {
    case "cards":
      return <ExperienceCards experience={experience} />;

    case "compact":
      return <ExperienceCompact experience={experience} />;

    case "timeline":
    default:
      return <ExperienceTimeline experience={experience} />;
  }
}