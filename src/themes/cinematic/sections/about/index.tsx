import type { ComponentType } from "react";
import type { SectionProps } from "../shared/types";
import { AboutDefault } from "./AboutDefault";

export const variants = { default: AboutDefault } as const;

export function About({ variant = "default", ...props }: SectionProps & { variant?: string }) {
  const Component: ComponentType<SectionProps> = variants[variant as keyof typeof variants] ?? AboutDefault;
  return <Component {...props} />;
}
