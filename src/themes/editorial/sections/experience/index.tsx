import type { ThemeSectionProps } from "../../../types";
import { ExperienceDefault } from "./ExperienceDefault";

export const variants = {
  default: ExperienceDefault,

} as const;
export function Experience({
 
  ...props
}: ThemeSectionProps & { variant?: string }) {
  const C =  ExperienceDefault;
  return <C {...props} />;
}
