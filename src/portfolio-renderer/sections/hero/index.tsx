import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

import { HeroMinimal } from "./HeroMinimal";
import { HeroModern } from "./HeroModern";
import { HeroCreative } from "./HeroCreative";
import { HeroCentered } from "./HeroCentered";
import { HeroSplit } from "./HeroSplit";

export function HeroSection({
  variant,
  config,
  profile,
}: {
  variant?: string;
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
}) {
  switch (variant) {
    case "minimal":
      return <HeroMinimal config={config} profile={profile} />;

    case "modern":
      return <HeroModern config={config} profile={profile} />;

    case "creative":
      return <HeroCreative config={config} profile={profile} />;

    case "centered":
      return <HeroCentered config={config} profile={profile} />;

    case "split":
      return <HeroSplit config={config} profile={profile} />;

    default:
      return <HeroMinimal config={config} profile={profile} />;
  }
}
