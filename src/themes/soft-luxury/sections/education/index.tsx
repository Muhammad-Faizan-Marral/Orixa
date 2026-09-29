import type { ThemeSectionProps } from "../../../types";
import { EducationDefault } from "./EducationDefault";

export const variants = {
  default: EducationDefault,
} as const;
export function Education({
 
  ...props
}: ThemeSectionProps & { variant?: string }) {
  const C =  EducationDefault;
  return <C {...props} />;
}
