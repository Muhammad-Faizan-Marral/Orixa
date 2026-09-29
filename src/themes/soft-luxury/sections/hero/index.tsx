import type { ThemeSectionProps } from "../../../types";
import HeroDefault from "./HeroDefault";
import HeroDinoBite from "./HeroDinoBite";


export function Hero({
  ...props
}: ThemeSectionProps & { variant?: string }) {
  const C =  HeroDefault;
  return <C {...props} />;
}
