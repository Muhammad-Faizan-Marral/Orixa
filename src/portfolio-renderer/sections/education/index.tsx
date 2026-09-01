import type { RendererEducation } from "../../types";
import { EducationDetailed } from "./EducationDetailed";
import { EducationSimple } from "./EducationSimple";
import { EducationTimeline } from "./EducationTimeline";

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

    case "simple":
    default:
      return <EducationSimple education={education} />;
  }
}