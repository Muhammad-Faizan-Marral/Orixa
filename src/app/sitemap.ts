import type { MetadataRoute } from "next";
import { BLOG_ARTICLES } from "@/content/blog";

const SITE_URL = "https://www.orixaai.me";

// Keep the result inside the sitemap protocol's 50,000-URL limit. A separate
// sitemap index can be introduced later if the published portfolio count grows.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/pricing`, priority: 0.8 },
    { url: `${SITE_URL}/blog`, priority: 0.8 },
    { url: `${SITE_URL}/portfolio-builder`, priority: 0.9 },
    { url: `${SITE_URL}/developer-portfolio-builder`, priority: 0.8 },
    { url: `${SITE_URL}/resume-to-portfolio`, priority: 0.8 },
    { url: `${SITE_URL}/ats-resume-builder`, priority: 0.8 },
    { url: `${SITE_URL}/portfolio-analytics`, priority: 0.7 },
    { url: `${SITE_URL}/portfolio-templates`, priority: 0.7 },
    { url: `${SITE_URL}/terms`, priority: 0.2 },
    { url: `${SITE_URL}/privacy`, priority: 0.2 },
  ];

  const blogPages: MetadataRoute.Sitemap = BLOG_ARTICLES.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.updatedAt ?? article.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Published portfolios are public, user-generated pages and should be
  // discoverable from the sitemap. Load the database dynamically so a missing
  // build-time DATABASE_URL cannot prevent the public marketing sitemap from
  // rendering; in that case, return the static URLs and retry on revalidation.
  try {
    const [{ db }, schema, drizzle] = await Promise.all([
      import("@/db"),
      import("@/db/schema"),
      import("drizzle-orm"),
    ]);

    const publishedRows = await db
      .select({
        username: schema.profiles.username,
        slug: schema.portfolios.slug,
        publishedAt: schema.portfolios.publishedAt,
        portfolioUpdatedAt: schema.portfolios.updatedAt,
        profileUpdatedAt: schema.profiles.updatedAt,
        publicProfile: schema.settings.publicProfile,
        configJson: schema.portfolioVersions.configJson,
        legacySeo: schema.portfolioData.seo,
      })
      .from(schema.portfolios)
      .innerJoin(
        schema.profiles,
        drizzle.eq(schema.portfolios.profileId, schema.profiles.id),
      )
      .leftJoin(
        schema.settings,
        drizzle.eq(schema.settings.profileId, schema.profiles.id),
      )
      .leftJoin(
        schema.portfolioVersions,
        drizzle.and(
          drizzle.eq(schema.portfolioVersions.portfolioId, schema.portfolios.id),
          drizzle.eq(schema.portfolioVersions.published, true),
        ),
      )
      .leftJoin(
        schema.portfolioData,
        drizzle.eq(schema.portfolioData.portfolioId, schema.portfolios.id),
      )
      .where(drizzle.eq(schema.portfolios.status, "published"))
      .orderBy(drizzle.desc(schema.portfolios.publishedAt))
      .limit(24_000);

    // Respect each published portfolio's own noindex setting as well as the
    // legacy SEO config fallback used by the public renderer.
    const indexableRows = publishedRows.filter((row) => {
      const publishedConfig = row.configJson as
        | { seo?: { noIndex?: boolean } }
        | null;
      const legacySeo = row.legacySeo as { noIndex?: boolean } | null;
      const seo = publishedConfig ? publishedConfig.seo : legacySeo;
      return seo?.noIndex !== true;
    });

    const portfolioPagesByUrl = new Map<
      string,
      MetadataRoute.Sitemap[number]
    >();
    const publicProfilePagesByUsername = new Map<
      string,
      MetadataRoute.Sitemap[number]
    >();

    for (const row of indexableRows) {
      const portfolioUrl = `${SITE_URL}/${row.username}/${row.slug}`;
      if (!portfolioPagesByUrl.has(portfolioUrl)) {
        portfolioPagesByUrl.set(portfolioUrl, {
          url: portfolioUrl,
          lastModified: new Date(row.publishedAt ?? row.portfolioUpdatedAt),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }

      // A hidden public-profile directory should not be listed. Published
      // portfolio URLs remain eligible because those portfolios were explicitly published.
      if (
        row.publicProfile !== false &&
        !publicProfilePagesByUsername.has(row.username)
      ) {
        publicProfilePagesByUsername.set(row.username, {
          url: `${SITE_URL}/${row.username}`,
          lastModified: new Date(row.profileUpdatedAt),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    }

    return [
      ...publicPages,
      ...blogPages,
      ...Array.from(publicProfilePagesByUsername.values()),
      ...Array.from(portfolioPagesByUrl.values()),
    ];
  } catch {
    console.error(
      "[sitemap] Could not load published portfolio URLs; returning the static sitemap.",
    );
    return [...publicPages, ...blogPages];
  }
}
