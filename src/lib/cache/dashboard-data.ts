import { cache } from "react";
import { unstable_cache } from "next/cache";
import { portfolioRepository } from "@/repositories/portfolio.repository";
import { settingsRepository } from "@/repositories/settings.repository";

/** Same React request: layout + page share one DB hit */
export const getUserPortfoliosCached = cache(async (profileId: string) => {
  return unstable_cache(
    async () => portfolioRepository.findByProfileId(profileId),
    [`portfolios-list-${profileId}`],
    { revalidate: 30, tags: [`portfolios-${profileId}`] },
  )();
});

export const getSettingsCached = cache(async (profileId: string) => {
  return unstable_cache(
    async () => settingsRepository.createIfNotExists(profileId),
    [`settings-${profileId}`],
    { revalidate: 60, tags: [`settings-${profileId}`] },
  )();
});
