import type { ComponentType } from "react";
import type { SectionProps } from "../shared/types";
import { SkillsDefault } from "./SkillsDefault";

export const variants = { default: SkillsDefault } as const;

export function Skills({ variant = "default", ...props }: SectionProps & { variant?: string }) {
  const Component: ComponentType<SectionProps> = variants[variant as keyof typeof variants] ?? SkillsDefault;
  return <Component {...props} />;
}