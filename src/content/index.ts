import aiPortfolio from "./blog/what-is-an-ai-portfolio";
import developerPortfolio from "./blog/how-to-build-developer-portfolio";
import portfolioExamples from "./blog/developer-portfolio-examples";
import bestPortfolioBuilder from "./blog/best-portfolio-builder-for-developers";
import portfolioAnalytics from "./blog/portfolio-analytics-explained";
import type { BlogArticle } from "./blog/types";

export const BLOG_ARTICLES: BlogArticle[] = [
  aiPortfolio,
  developerPortfolio,
  portfolioExamples,
  bestPortfolioBuilder,
  portfolioAnalytics,
];

export const BLOG_ARTICLES_BY_SLUG: Record<string, BlogArticle> =
  Object.fromEntries(BLOG_ARTICLES.map((article) => [article.slug, article]));
