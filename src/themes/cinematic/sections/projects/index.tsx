import type { ComponentType } from "react";
import type { SectionProps } from "../shared/types";
import { ProjectsDefault } from "./ProjectsDefault";

export const variants = { default: ProjectsDefault } as const;

export function Projects({ variant = "default", ...props }: SectionProps & { variant?: string }) {
  const Component: ComponentType<SectionProps> = variants[variant as keyof typeof variants] ?? ProjectsDefault;
  return <Component {...props} />;
}