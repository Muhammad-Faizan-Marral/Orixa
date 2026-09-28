import type { ThemeSectionProps } from "../../../types";
import { ProjectsDefault } from "./ProjectsDefault";

export const variants = { default: ProjectsDefault, } as const;
export function Projects({
 
  ...props
}: ThemeSectionProps & { variant?: string }) {
  const C = ProjectsDefault;
  return <C {...props} />;
}
