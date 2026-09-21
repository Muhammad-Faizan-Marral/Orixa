import { notFound } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { PortfolioDesignLabClient } from "@/features/portfolio/design-lab/portfolio-design-lab-client";
import type { PortfolioRenderConfig } from "@/portfolio-renderer/types";
import { isPremiumActive } from "@/constants/billing";
type Props = {
  params: Promise<{ portfolioId: string }>;
};

export default async function PortfolioDesignLabPage({ params }: Props) {
  await requireUser();
  const profile = await requireProfile();
  const { portfolioId } = await params;

  const result = await portfolioService.getPortfolioWithData(
    portfolioId,
    profile.id,
  );

  if (!result) notFound();

  const { portfolio, data } = result;
  const d = (data ?? {}) as Record<string, unknown>;
  const isPremium = isPremiumActive({
    isPremium: profile.isPremium,
    premiumUntil: profile.premiumUntil,
  });
  const initialConfig: PortfolioRenderConfig = {
    name: (d.name as string) || portfolio.title,
    headline: (d.headline as string) || undefined,
    about: (d.about as string) || undefined,
    phone: (d.phone as string) || undefined,
    linkedinUrl: (d.linkedinUrl as string) || undefined,
    githubUrl: (d.githubUrl as string) || undefined,
    avatarUrl: (d.avatarUrl as string) || profile.avatarUrl || undefined,
    resumeUrl: (d.resumeUrl as string) || undefined,
    skills: (d.skills as PortfolioRenderConfig["skills"]) || [],
    projects: (d.projects as PortfolioRenderConfig["projects"]) || [],
    experience: (d.experience as PortfolioRenderConfig["experience"]) || [],
    education: (d.education as PortfolioRenderConfig["education"]) || [],
    certificates:
      (d.certificates as PortfolioRenderConfig["certificates"]) || [],
    animations: d.animations !== false,
    componentSelection:
      d.componentSelection as PortfolioRenderConfig["componentSelection"],
    designPreferences:
      d.designPreferences as PortfolioRenderConfig["designPreferences"],
    portfolioId: portfolio.id,
  };

  return (
    <PortfolioDesignLabClient
      portfolioId={portfolio.id}
      portfolioTitle={portfolio.title}
      isPremium={isPremium}
      profile={{
        username: profile.username,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
        
      }}
      initialConfig={initialConfig}
    />
  );
}
