import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { portfolioData, portfolios, portfolioVersions } from "@/db/schema";

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

  async restoreVersion(
    portfolioId: string,
    profileId: string,
    version: number,
  ) {
    return db.transaction(async (tx) => {
      // 1. Verify portfolio ownership
      const [portfolio] = await tx
        .select()
        .from(portfolios)
        .where(
          and(
            eq(portfolios.id, portfolioId),
            eq(portfolios.profileId, profileId),
          ),
        )
        .limit(1);

      if (!portfolio) {
        return null;
      }

      // 2. Get requested version
      const [selectedVersion] = await tx
        .select()
        .from(portfolioVersions)
        .where(
          and(
            eq(portfolioVersions.portfolioId, portfolioId),
            eq(portfolioVersions.version, version),
          ),
        )
        .limit(1);

      if (!selectedVersion) {
        return null;
      }

      const config = selectedVersion.configJson as {
        headline?: string | null;
        about?: string | null;
        projects?: unknown[];
        experience?: unknown[];
        skills?: unknown[];
        education?: unknown[];
        certificates?: unknown[];
        resumeUrl?: string | null;
        theme?: string | null;
        animations?: boolean;
        componentSelection?: Record<string, unknown>;
        designPreferences?: Record<string, unknown>;
        seo?: Record<string, unknown>;
      };

      // 3. Restore snapshot into current working data
      const [updatedData] = await tx
        .update(portfolioData)
        .set({
          headline: config.headline ?? null,
          about: config.about ?? null,
          projects: config.projects ?? [],
          experience: config.experience ?? [],
          skills: config.skills ?? [],
          education: config.education ?? [],
          certificates: config.certificates ?? [],
          resumeUrl: config.resumeUrl ?? null,
          theme: config.theme ?? "minimal",
          animations: config.animations ?? true,
          componentSelection: config.componentSelection ?? {},
          designPreferences: config.designPreferences ?? {},
          seo: config.seo ?? {},
          updatedAt: new Date().toISOString(),
        })
        .where(eq(portfolioData.portfolioId, portfolioId))
        .returning();

      if (!updatedData) {
        throw new Error("Unable to restore portfolio data.");
      }

      // 4. Restoring means the working copy needs review.
      //    DO NOT modify portfolio_versions.
      const [updatedPortfolio] = await tx
        .update(portfolios)
        .set({
          status: "draft",
          publishedAt: null,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(portfolios.id, portfolioId),
            eq(portfolios.profileId, profileId),
          ),
        )
        .returning();

      if (!updatedPortfolio) {
        throw new Error("Unable to restore portfolio.");
      }

      return {
        portfolio: updatedPortfolio,
        data: updatedData,
        restoredVersion: selectedVersion,
      };
    });
  }
}

export const portfolioVersionRepository = new PortfolioVersionRepository();
