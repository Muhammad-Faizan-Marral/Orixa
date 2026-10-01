import type { ComponentType } from "react";
import type { SectionProps } from "../shared/types";
import { CertificatesDefault } from "./CertificatesDefault";

export const variants = { default: CertificatesDefault } as const;

export function Certificates({ variant = "default", ...props }: SectionProps & { variant?: string }) {
  const Component: ComponentType<SectionProps> =
    variants[variant as keyof typeof variants] ?? CertificatesDefault;
  return <Component {...props} />;
}