import type { PortfolioRenderConfig } from "../../types";
import { AboutDefault } from "./AboutDefault";
import { AboutCards } from "./AboutCards";
import { AboutSplit } from "./AboutSplit";

export function AboutSection({
  variant,
  config,
}: {
  variant?: string;
  config: PortfolioRenderConfig;
}) {
  switch (variant) {
    case "cards":
      return <AboutCards config={config} />;

    case "split":
      return <AboutSplit config={config} />;

    case "default":
    default:
      return <AboutDefault config={config} />;
  }
}