import { and, count, desc, eq, gte, sql } from "drizzle-orm";

import { db } from "@/db";
import { portfolios, portfolioViews } from "@/db/schema";

export class PortfolioViewRepository {
  async create(data: {
    portfolioId: string;
    country?: string | null;
    city?: string | null;
    browser?: string | null;
    device?: string | null;
    os?: string | null;
    referrer?: string | null;
    ipHash?: string | null;
  }) {
    const [view] = await db
      .insert(portfolioViews)
      .values({
        portfolioId: data.portfolioId,
        country: data.country ?? null,
        city: data.city ?? null,
        browser: data.browser ?? null,
        device: data.device ?? null,
        os: data.os ?? null,
        referrer: data.referrer ?? null,
        ipHash: data.ipHash ?? null,
      })
      .returning();

    return view;
  }

  async getTotalViews(portfolioId: string) {
    const [result] = await db
      .select({
        count: count(),
      })
      .from(portfolioViews)
      .where(eq(portfolioViews.portfolioId, portfolioId));

    return Number(result?.count ?? 0);
  }

  async getViewsSince(portfolioId: string, since: string) {
    const [result] = await db
      .select({
        count: count(),
      })
      .from(portfolioViews)
      .where(
        and(
          eq(portfolioViews.portfolioId, portfolioId),
          gte(portfolioViews.visitedAt, since),
        ),
      );

    return Number(result?.count ?? 0);
  }

  async getTopCountries(portfolioId: string) {
    return db
      .select({
        country: portfolioViews.country,
        views: count(),
      })
      .from(portfolioViews)
      .where(
        and(
          eq(portfolioViews.portfolioId, portfolioId),
          sql`${portfolioViews.country} IS NOT NULL`,
        ),
      )
      .groupBy(portfolioViews.country)
      .orderBy(desc(count()))
      .limit(10);
  }

  async getTopReferrers(portfolioId: string) {
    return db
      .select({
        referrer: portfolioViews.referrer,
        views: count(),
      })
      .from(portfolioViews)
      .where(
        and(
          eq(portfolioViews.portfolioId, portfolioId),
          sql`${portfolioViews.referrer} IS NOT NULL`,
        ),
      )
      .groupBy(portfolioViews.referrer)
      .orderBy(desc(count()))
      .limit(10);
  }

  async getRecentViews(portfolioId: string) {
    return db
      .select()
      .from(portfolioViews)
      .where(eq(portfolioViews.portfolioId, portfolioId))
      .orderBy(desc(portfolioViews.visitedAt))
      .limit(20);
  }

  async getAnalytics(portfolioId: string) {
    const now = Date.now();

    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

    const thirtyDaysAgo = new Date(
      now - 30 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const [total, last7Days, last30Days, countries, referrers, recentViews] =
      await Promise.all([
        this.getTotalViews(portfolioId),

        this.getViewsSince(portfolioId, sevenDaysAgo),

        this.getViewsSince(portfolioId, thirtyDaysAgo),

        this.getTopCountries(portfolioId),

        this.getTopReferrers(portfolioId),

        this.getRecentViews(portfolioId),
      ]);

    return {
      total,
      last7Days,
      last30Days,
      countries,
      referrers,
      recentViews,
    };
  }

  async verifyPortfolioExists(portfolioId: string) {
    const [portfolio] = await db
      .select({
        id: portfolios.id,
        status: portfolios.status,
      })
      .from(portfolios)
      .where(eq(portfolios.id, portfolioId))
      .limit(1);

    return portfolio ?? null;
  }
}

export const portfolioViewRepository = new PortfolioViewRepository();
