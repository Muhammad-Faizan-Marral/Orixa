import type { ComponentType } from "react";
import type { SectionProps } from "../shared/types";
import { EducationDefault } from "./EducationDefault";

export const variants = { default: EducationDefault } as const;

export function Education({ variant = "default", ...props }: SectionProps & { variant?: string }) {
  const Component: ComponentType<SectionProps> = variants[variant as keyof typeof variants] ?? EducationDefault;
  return <Component {...props} />;
}