import type { ThemeSectionProps } from "../../../types";
import  AboutDefault  from "./AboutDefault";

export const variants = { default: AboutDefault, } as const;
export function About({
  variant = "default",
  ...props
}: ThemeSectionProps & { variant?: string }) {
  const C = variants[variant as keyof typeof variants] || AboutDefault;
  return <C {...props} />;
}
