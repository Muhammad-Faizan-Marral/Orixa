import type { ThemeSectionProps } from "../../../types";
import { NavbarDefault } from "./NavbarDefault";

export const variants = { default: NavbarDefault } as const;
export function Navbar({
  variant = "default",
  ...props
}: ThemeSectionProps & { variant?: string }) {
  const Component = NavbarDefault;
  return <Component {...props} />;
}
