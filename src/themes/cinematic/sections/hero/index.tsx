import type { ComponentType } from "react";
import type { SectionProps } from "../shared/types";
import { HeroDefault } from "./HeroDefault";

export const variants = { default: HeroDefault } as const;

export function Hero({ variant = "default", ...props }: SectionProps & { variant?: string }) {
  const Component: ComponentType<SectionProps> = variants[variant as keyof typeof variants] ?? HeroDefault;
  return <Component {...props} />;
}
