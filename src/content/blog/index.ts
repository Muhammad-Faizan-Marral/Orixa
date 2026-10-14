import aiPortfolio from "./what-is-an-ai-portfolio";
import developerPortfolio from "./how-to-build-developer-portfolio";
import portfolioExamples from "./developer-portfolio-examples";
import bestPortfolioBuilder from "./best-portfolio-builder-for-developers";
import portfolioAnalytics from "./portfolio-analytics-explained";
import portfolioBuilderVsWebsiteBuilder from "./ai-portfolio-builder-vs-website-builder";
import type { BlogArticle } from "./types";

export const BLOG_ARTICLES: BlogArticle[] = [
  aiPortfolio,
  developerPortfolio,
  portfolioExamples,
  bestPortfolioBuilder,
  portfolioAnalytics,
  portfolioBuilderVsWebsiteBuilder,
];

export const BLOG_ARTICLES_BY_SLUG: Record<string, BlogArticle> =
  Object.fromEntries(BLOG_ARTICLES.map((article) => [article.slug, article]));
