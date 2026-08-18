import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { portfolioData, portfolioVersions } from "@/db/schema";

export class PortfolioVersionRepository {
  async getLatestVersion(portfolioId: string) {
    const [version] = await db
      .select()
      .from(portfolioVersions)
      .where(eq(portfolioVersions.portfolioId, portfolioId))
      .orderBy(desc(portfolioVersions.version))
      .limit(1);

    return version ?? null;
  }

  async getVersion(portfolioId: string, version: number) {
    const [result] = await db
      .select()
      .from(portfolioVersions)
      .where(
        and(
          eq(portfolioVersions.portfolioId, portfolioId),
          eq(portfolioVersions.version, version),
        ),
      )
      .limit(1);

    return result ?? null;
  }

  async getVersions(portfolioId: string) {
    return db
      .select()
      .from(portfolioVersions)
      .where(eq(portfolioVersions.portfolioId, portfolioId))
      .orderBy(desc(portfolioVersions.version));
  }

  async create(portfolioId: string, version: number, configJson: unknown) {
    const [result] = await db
      .insert(portfolioVersions)
      .values({
        portfolioId,
        version,
        configJson,
        published: true,
      })
      .returning();

    return result;
  }

  async markAllUnpublished(portfolioId: string) {
    await db
      .update(portfolioVersions)
      .set({
        published: false,
      })
      .where(eq(portfolioVersions.portfolioId, portfolioId));
  }

  async createPublishedVersion(portfolioId: string, configJson: unknown) {
    return db.transaction(async (tx) => {
      const [latest] = await tx
        .select({
          version: portfolioVersions.version,
        })
        .from(portfolioVersions)
        .where(eq(portfolioVersions.portfolioId, portfolioId))
        .orderBy(desc(portfolioVersions.version))
        .limit(1);

      const nextVersion = (latest?.version ?? 0) + 1;

      await tx
        .update(portfolioVersions)
        .set({
          published: false,
        })
        .where(eq(portfolioVersions.portfolioId, portfolioId));

      const [version] = await tx
        .insert(portfolioVersions)
        .values({
          portfolioId,
          version: nextVersion,
          configJson,
          published: true,
        })
        .returning();

      return version;
    });
  }

  async getPublishedVersion(portfolioId: string) {
    const [version] = await db
      .select()
      .from(portfolioVersions)
      .where(
        and(
          eq(portfolioVersions.portfolioId, portfolioId),
          eq(portfolioVersions.published, true),
        ),
      )
      .orderBy(desc(portfolioVersions.version))
      .limit(1);

    return version ?? null;
  }
}

export const portfolioVersionRepository = new PortfolioVersionRepository();
