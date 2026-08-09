import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { portfolioData, portfolios } from "@/db/schema";

export class PortfolioRepository {
  async findById(id: string) {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.id, id))
      .limit(1);

    return portfolio ?? null;
  }

  async findByIdAndProfileId(id: string, profileId: string) {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(and(eq(portfolios.id, id), eq(portfolios.profileId, profileId)))
      .limit(1);

    return portfolio ?? null;
  }

  async findByProfileId(profileId: string) {
    return db
      .select()
      .from(portfolios)
      .where(eq(portfolios.profileId, profileId))
      .orderBy(desc(portfolios.updatedAt));
  }

  async findByProfileAndSlug(profileId: string, slug: string) {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(
        and(eq(portfolios.profileId, profileId), eq(portfolios.slug, slug)),
      )
      .limit(1);

    return portfolio ?? null;
  }

  async create(
    profileId: string,
    data: {
      title: string;
      slug: string;
      headline?: string;
      about?: string;
      theme?: string;
    },
  ) {
    return db.transaction(async (tx) => {
      const [portfolio] = await tx
        .insert(portfolios)
        .values({
          profileId,
          title: data.title,
          slug: data.slug,
        })
        .returning();

      if (!portfolio) {
        throw new Error("Unable to create portfolio.");
      }

      await tx.insert(portfolioData).values({
        portfolioId: portfolio.id,
        headline: data.headline || null,
        about: data.about || null,
        theme: data.theme || "minimal",
      });

      return portfolio;
    });
  }

  async update(
    id: string,
    profileId: string,
    data: {
      title?: string;
      slug?: string;
    },
  ) {
    const [portfolio] = await db
      .update(portfolios)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(portfolios.id, id), eq(portfolios.profileId, profileId)))
      .returning();

    return portfolio ?? null;
  }

  async archive(id: string, profileId: string) {
    const [portfolio] = await db
      .update(portfolios)
      .set({
        status: "archived",
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(portfolios.id, id), eq(portfolios.profileId, profileId)))
      .returning();

    return portfolio ?? null;
  }

  async findWithData(id: string, profileId: string) {
    const portfolio = await this.findByIdAndProfileId(id, profileId);

    if (!portfolio) {
      return null;
    }

    const [data] = await db
      .select()
      .from(portfolioData)
      .where(eq(portfolioData.portfolioId, portfolio.id))
      .limit(1);

    return {
      portfolio,
      data: data ?? null,
    };
  }
}

export const portfolioRepository = new PortfolioRepository();
