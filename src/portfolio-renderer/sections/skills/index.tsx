import type { RendererSkill } from "../../types";
import { SkillsBars } from "./SkillsBars";
import { SkillsGrid } from "./SkillsGrid";
import { SkillsList } from "./SkillsList";
import { SkillsTags } from "./SkillsTags";

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

    case "grid":
    default:
      return <SkillsGrid skills={skills} />;
  }
}