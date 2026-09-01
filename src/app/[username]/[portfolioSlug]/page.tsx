import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { portfolioService } from "@/services/portfolio/portfolio.service";

import type { PortfolioRenderConfig } from "@/portfolio-renderer/types";
import { PortfolioViewTracker } from "@/features/portfolio/components/portfolio-view-tracker";
import { DesignEngine } from "@/portfolio-renderer/DesignEngine";

type Props = {
  params: Promise<{ username: string; portfolioSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, portfolioSlug } = await params;
  const pub = await portfolioService.getPublishedPublic(username, portfolioSlug);

  if (!pub) {
    return { title: "Portfolio not found" };
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

  const description =
    seo.description ||
    (typeof pub.config.about === "string"
      ? pub.config.about.slice(0, 160)
      : undefined);

  return {
    title,
    description,
    keywords: seo.keywords,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { username, portfolioSlug } = await params;

  const pub = await portfolioService.getPublishedPublic(username, portfolioSlug);

  if (!pub) {
    notFound();
  }

  const config = pub.config as PortfolioRenderConfig;

  return (
    <>
      <DesignEngine
        config={config}
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