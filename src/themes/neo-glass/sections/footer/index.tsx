import type { ThemeSectionProps } from "../../../types";
import { FooterDefault } from "./FooterDefault";

export const variants = { default: FooterDefault } as const;
export function Footer({

  ...props
}: ThemeSectionProps & { variant?: string }) {
  const C =  FooterDefault;
  return <C {...props} />;
}
