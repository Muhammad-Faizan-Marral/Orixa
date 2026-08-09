import { eq, and, desc } from "drizzle-orm";

import { db } from "@/db";
import { portfolios } from "@/db/schema";

class PortfolioRepository {
  async findByProfileId(profileId: string) {
    return db
      .select({
        id: portfolios.id,
        profileId: portfolios.profileId,
        title: portfolios.title,
        slug: portfolios.slug,
        status: portfolios.status,
        currentVersion: portfolios.currentVersion,
        publishedAt: portfolios.publishedAt,
        createdAt: portfolios.createdAt,
        updatedAt: portfolios.updatedAt,
      })
      .from(portfolios)
      .where(eq(portfolios.profileId, profileId))
      .orderBy(desc(portfolios.updatedAt));
  }

  async findById(id: string) {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.id, id))
      .limit(1);

    return portfolio ?? null;
  }

  async findByProfileAndSlug(profileId: string, slug: string) {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(
        and(
          eq(portfolios.profileId, profileId),
          eq(portfolios.slug, slug),
        ),
      )
      .limit(1);

    return portfolio ?? null;
  }
}

export const portfolioRepository = new PortfolioRepository();