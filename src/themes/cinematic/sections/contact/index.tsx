import type { ComponentType } from "react";
import type { SectionProps } from "../shared/types";
import { ContactDefault } from "./ContactDefault";

export const variants = { default: ContactDefault } as const;

export function Contact({ variant = "default", ...props }: SectionProps & { variant?: string }) {
  const Component: ComponentType<SectionProps> = variants[variant as keyof typeof variants] ?? ContactDefault;
  return <Component {...props} />;
}