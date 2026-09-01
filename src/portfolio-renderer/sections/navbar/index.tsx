import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";
import { NavbarMinimal } from "./NavbarMinimal";
import { NavbarFloating } from "./NavbarFloating";

export function NavbarSection({
  variant,
  config,
  profile,
}: {
  variant?: string;
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
}) {
  switch (variant) {
    case "floating":
      return <NavbarFloating config={config} profile={profile} />;

    case "minimal":
    default:
      return <NavbarMinimal config={config} profile={profile} />;
  }
}