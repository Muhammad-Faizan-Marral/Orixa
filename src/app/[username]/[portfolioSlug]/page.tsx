import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { PortfolioRenderConfig } from "@/portfolio-renderer/types";
import { PortfolioViewTracker } from "@/features/portfolio/components/portfolio-view-tracker";
import { DesignEngine } from "@/portfolio-renderer/DesignEngine";
import { getCachedPublishedPortfolio } from "@/lib/cache/portfolio-public";
import { isPremiumActive } from "@/constants/billing";

type Props = {
  params: Promise<{ username: string; portfolioSlug: string }>;
};

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, portfolioSlug } = await params;
  const pub = await getCachedPublishedPortfolio(username, portfolioSlug);

  if (!pub) {
    return {
      title: "Portfolio not found",
      robots: { index: false, follow: false },
    };
  }

  const seo = (pub.config.seo ?? {}) as {
    title?: string;
    description?: string;
    keywords?: string[];
    noIndex?: boolean;
  };

  const title =
    seo.title ||
    (pub.config.headline as string) ||
    (pub.config.name as string) ||
    `${pub.profile.username} · Portfolio`;

  const about =
    typeof pub.config.about === "string" ? pub.config.about.trim() : "";
  const headline =
    typeof pub.config.headline === "string" ? pub.config.headline.trim() : "";
  const name =
    typeof pub.config.name === "string" && pub.config.name.trim()
      ? pub.config.name.trim()
      : pub.profile.fullName || pub.profile.username;
  const description = (
    seo.description ||
    about ||
    headline ||
    `${name}'s portfolio showcasing professional work, skills, and experience.`
  ).slice(0, 160);

  const canonicalPath = `/${username}/${portfolioSlug}`;
  const canonicalUrl = `https://www.orixaai.me${canonicalPath}`;

  return {
    title,
    description,
    keywords: seo.keywords,
    alternates: { canonical: canonicalPath },
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "OrixaAI",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { username, portfolioSlug } = await params;

  const pub = await getCachedPublishedPortfolio(username, portfolioSlug);

  if (!pub) {
    notFound();
  }

  const config = pub.config as PortfolioRenderConfig;
  const isPremium = isPremiumActive({
    isPremium: pub.profile.isPremium ?? false,
    premiumUntil: pub.profile.premiumUntil ?? null,
  });

  return (
    <>
      <DesignEngine
        config={{
          ...config,
          portfolioId: pub.portfolio.id,
        }}
        profile={{
          username: pub.profile.username,
          fullName: pub.profile.fullName,
          avatarUrl: pub.profile.avatarUrl,
          isPremium,
        }}
      />
      <PortfolioViewTracker portfolioId={pub.portfolio.id} />
    </>
  );
}
