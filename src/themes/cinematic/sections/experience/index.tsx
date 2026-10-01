import type { ComponentType } from "react";
import type { SectionProps } from "../shared/types";
import { ExperienceDefault } from "./ExperienceDefault";

export const variants = { default: ExperienceDefault } as const;

export function Experience({ variant = "default", ...props }: SectionProps & { variant?: string }) {
  const Component: ComponentType<SectionProps> = variants[variant as keyof typeof variants] ?? ExperienceDefault;
  return <Component {...props} />;
}