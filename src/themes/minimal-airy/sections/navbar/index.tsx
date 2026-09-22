import type { ThemeSectionProps } from "../../../types";
import { NavbarDefault } from "./NavbarDefault";
import { NavbarAlt } from "./NavbarAlt";
export const variants = { default: NavbarDefault, alt: NavbarAlt } as const;
export function Navbar({
  variant = "default",
  ...props
}: ThemeSectionProps & { variant?: string }) {
  const Component = variants[variant as keyof typeof variants] || NavbarDefault;
  return <Component {...props} />;
}
