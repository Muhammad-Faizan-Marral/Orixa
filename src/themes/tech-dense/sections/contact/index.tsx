import type { ThemeSectionProps } from "../../../types";
import { ContactDefault } from "./ContactDefault";
export const variants = { default: ContactDefault, } as const;
export function Contact({
  variant = "default",
  ...props
}: ThemeSectionProps & { variant?: string }) {
  const C = variants[variant as keyof typeof variants] || ContactDefault;
  return <C {...props} />;
}
