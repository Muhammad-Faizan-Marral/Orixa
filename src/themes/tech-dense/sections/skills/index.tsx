import type { ThemeSectionProps } from "../../../types";
import { SkillsDefault } from "./SkillsDefault";

export const variants = { default: SkillsDefault, } as const;
export function Skills({
  variant = "default",
  ...props
}: ThemeSectionProps & { variant?: string }) {
  const C = SkillsDefault;
  return <C {...props} />;
}
