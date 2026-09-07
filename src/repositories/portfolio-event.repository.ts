import { and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { portfolioEvents } from "@/db/schema";

export class PortfolioEventRepository {
  async create(data: {
    portfolioId: string;
    eventType: string;
    label?: string | null;
    referrer?: string | null;
    country?: string | null;
    ipHash?: string | null;
  }) {
    const [row] = await db
      .insert(portfolioEvents)
      .values({
        portfolioId: data.portfolioId,
        eventType: data.eventType,
        label: data.label ?? null,
        referrer: data.referrer ?? null,
        country: data.country ?? null,
        ipHash: data.ipHash ?? null,
      })
      .returning();

    return row;
  }

  async countByType(portfolioId: string, eventType: string) {
    const [result] = await db
      .select({ count: count() })
      .from(portfolioEvents)
      .where(
        and(
          eq(portfolioEvents.portfolioId, portfolioId),
          eq(portfolioEvents.eventType, eventType),
        ),
      );

    return Number(result?.count ?? 0);
  }

  async topLabels(portfolioId: string, eventType: string, limit = 5) {
    return db
      .select({
        label: portfolioEvents.label,
        count: count(),
      })
      .from(portfolioEvents)
      .where(
        and(
          eq(portfolioEvents.portfolioId, portfolioId),
          eq(portfolioEvents.eventType, eventType),
          sql`${portfolioEvents.label} IS NOT NULL`,
        ),
      )
      .groupBy(portfolioEvents.label)
      .orderBy(desc(count()))
      .limit(limit);
  }
}

export const portfolioEventRepository = new PortfolioEventRepository();
