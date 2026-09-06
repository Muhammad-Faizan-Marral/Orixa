import React from "react";
import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

// All navbar variants
import { NavbarFloating } from "./NavbarFloating";
import { NavbarMinimal } from "./NavbarMinimal";
import { NavbarGlass } from "./NavbarGlass";
import { NavbarSidebarTrigger } from "./NavbarSidebarTrigger";

type NavbarSectionProps = {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
  variant?: string;
};

export const NavbarSection: React.FC<NavbarSectionProps> = ({
  config,
  profile,
  variant = "floating",
}) => {
  switch (variant) {
    case "glass":
      return <NavbarGlass config={config} profile={profile} />;
    case "sidebar-trigger":
      return <NavbarSidebarTrigger config={config} profile={profile} />;
    case "minimal":
      return <NavbarMinimal config={config} profile={profile} />;
    case "floating":
    default:
      return <NavbarFloating config={config} profile={profile} />;
  }
};

export default NavbarSection;
