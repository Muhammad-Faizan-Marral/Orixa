import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";

import { portfolioService } from "@/services/portfolio/portfolio.service";
import type { PortfolioRenderConfig } from "@/portfolio-renderer/types";
import { PortfolioViewTracker } from "@/features/portfolio/components/portfolio-view-tracker";
import { DesignEngine } from "@/portfolio-renderer/DesignEngine";

type Props = {
  params: Promise<{ username: string; portfolioSlug: string }>;
};

const getCachedPublishedPortfolio = (username: string, portfolioSlug: string) =>
  unstable_cache(
    async () => {
      return portfolioService.getPublishedPublic(username, portfolioSlug);
    },
    ["published-portfolio", username, portfolioSlug],
    {
      tags: [`portfolio:${username}:${portfolioSlug}`, `user:${username}`],
      revalidate: 3600,
    },
  )();

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

  // The historical /orixaAi URL renders the same portfolio as /{username}/{slug}.
  // Canonicalize this variant to the primary public URL to avoid duplicate indexing.
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

/**
 * Canonical public portfolio URL:
 *   /{username}/{portfolioSlug}/orixaAi
 * Example: /faizan/merndeveloper/orixaAi
 */
export default async function PublicPortfolioBrandedPage({ params }: Props) {
  const { username, portfolioSlug } = await params;

  const pub = await getCachedPublishedPortfolio(username, portfolioSlug);

  if (!pub) {
    notFound();
  }

  const config = pub.config as PortfolioRenderConfig;

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
        }}
      />
      <PortfolioViewTracker portfolioId={pub.portfolio.id} />
    </>
  );
}