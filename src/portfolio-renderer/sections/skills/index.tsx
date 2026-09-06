import type { RendererSkill } from "../../types";
import { SkillsBars } from "./SkillsBars";
import { SkillsGrid } from "./SkillsGrid";
import { SkillsList } from "./SkillsList";
import { SkillsTags } from "./SkillsTags";
import { SkillsCloud } from "./SkillsCloud";
import { SkillsProgress } from "./SkillsProgress";
import { SkillsCards } from "./SkillsCards";

export function SkillsSection({
  variant,
  skills,
}: {
  variant?: string;
  skills: RendererSkill[];
}) {
  switch (variant) {
    case "bars":
      return <SkillsBars skills={skills} />;
    case "list":
      return <SkillsList skills={skills} />;
    case "tags":
      return <SkillsTags skills={skills} />;
    case "cloud":
      return <SkillsCloud skills={skills} />;
    case "progress":
      return <SkillsProgress skills={skills} />;
    case "cards":
      return <SkillsCards skills={skills} />;
    case "grid":
    default:
      return <SkillsGrid skills={skills} />;
  }
}