// src/portfolio-renderer/sections/experience/index.tsx
"use client";

import type { RendererExperience } from "../../types";
import { ExperienceCards } from "./ExperienceCards";
import { ExperienceCompact } from "./ExperienceCompact";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { ExperienceRail } from "./ExperienceRail";
import { ExperienceStack } from "./ExperienceStack";
import { ExperienceEditorial } from "./ExperienceEditorial";

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

    case "rail":
      return <ExperienceRail experience={experience} />;

    case "stack":
      return <ExperienceStack experience={experience} />;

    case "editorial":
      return <ExperienceEditorial experience={experience} />;

    case "timeline":
    default:
      return <ExperienceTimeline experience={experience} />;
  }
}

export { ExperienceCards } from "./ExperienceCards";
export { ExperienceCompact } from "./ExperienceCompact";
export { ExperienceTimeline } from "./ExperienceTimeline";
export { ExperienceRail } from "./ExperienceRail";
export { ExperienceStack } from "./ExperienceStack";
export { ExperienceEditorial } from "./ExperienceEditorial";
