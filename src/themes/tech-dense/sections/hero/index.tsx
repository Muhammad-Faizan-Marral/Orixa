import type { ThemeSectionProps } from "../../../types";
import HeroDefault from "./HeroDefault";


export function Hero({
  ...props
}: ThemeSectionProps & { variant?: string }) {
  const C =  HeroDefault;
  return <C {...props} />;
}
