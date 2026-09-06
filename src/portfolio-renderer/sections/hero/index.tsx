import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

import { HeroMinimal } from "./HeroMinimal";
import { HeroModern } from "./HeroModern";
import { HeroCreative } from "./HeroCreative";
import { HeroCentered } from "./HeroCentered";
import { HeroSplit } from "./HeroSplit";
import { HeroEditorial } from "./HeroEditorial";
import { HeroCinematic } from "./HeroCinematic";
import { HeroBrutalist } from "./HeroBrutalist";

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
    case "editorial":
      return <HeroEditorial config={config} profile={profile} />;
    case "cinematic":
      return <HeroCinematic config={config} profile={profile} />;
    case "brutalist":
      return <HeroBrutalist config={config} profile={profile} />;
    default:
      return <HeroMinimal config={config} profile={profile} />;
  }
}