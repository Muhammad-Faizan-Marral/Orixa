import type { ThemeSectionProps } from "../../../types";
import  {CertificatesDefault}  from "./CertificatesDefault";

export const variants = {
  default: CertificatesDefault,
 
} as const;
export function Certificates({
  variant = "default",
  ...props
}: ThemeSectionProps & { variant?: string }) {
  const C =  CertificatesDefault;
  return <C {...props} />;
}
