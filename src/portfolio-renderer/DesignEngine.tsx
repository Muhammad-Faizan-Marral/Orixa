import { ThemeEngine } from "@/themes/ThemeEngine";
import type { PortfolioRenderConfig, PublicProfileMeta } from "./types";

export function DesignEngine({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta & { isPremium?: boolean };
}) {
  return <ThemeEngine config={config} profile={profile} />;
}
