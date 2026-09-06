// src/portfolio-renderer/sections/education/index.tsx
"use client";

import type { RendererEducation } from "../../types";
import { EducationDetailed } from "./EducationDetailed";
import { EducationSimple } from "./EducationSimple";
import { EducationTimeline } from "./EducationTimeline";
import { EducationRail } from "./EducationRail";
import { EducationCards } from "./EducationCards";
import { EducationEditorial } from "./EducationEditorial";

export function EducationSection({
  variant,
  education,
}: {
  variant?: string;
  education: RendererEducation[];
}) {
  switch (variant) {
    case "detailed":
      return <EducationDetailed education={education} />;

    case "timeline":
      return <EducationTimeline education={education} />;

    case "rail":
      return <EducationRail education={education} />;

    case "cards":
      return <EducationCards education={education} />;

    case "editorial":
      return <EducationEditorial education={education} />;

    case "simple":
    default:
      return <EducationSimple education={education} />;
  }
}

export { EducationDetailed } from "./EducationDetailed";
export { EducationSimple } from "./EducationSimple";
export { EducationTimeline } from "./EducationTimeline";
export { EducationRail } from "./EducationRail";
export { EducationCards } from "./EducationCards";
export { EducationEditorial } from "./EducationEditorial";