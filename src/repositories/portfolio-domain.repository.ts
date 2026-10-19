import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { portfolioDomains, portfolios, profiles } from "@/db/schema";

export class PortfolioDomainRepository {
  async findByPortfolioId(portfolioId: string) {
    const [row] = await db
      .select()
      .from(portfolioDomains)
      .where(eq(portfolioDomains.portfolioId, portfolioId))
      .limit(1);
    return row ?? null;
  }

  async findByDomain(domain: string) {
    const [row] = await db
      .select()
      .from(portfolioDomains)
      .where(eq(portfolioDomains.domain, domain))
      .limit(1);
    return row ?? null;
  }

  /** For middleware / public resolve: domain → username + slug + status + premium */
  async resolveHost(domain: string) {
    const [row] = await db
      .select({
        domainId: portfolioDomains.id,
        domain: portfolioDomains.domain,
        status: portfolioDomains.status,
        portfolioId: portfolios.id,
        slug: portfolios.slug,
        portfolioStatus: portfolios.status,
        username: profiles.username,
        isPremium: profiles.isPremium,
        premiumUntil: profiles.premiumUntil,
      })
      .from(portfolioDomains)
      .innerJoin(portfolios, eq(portfolioDomains.portfolioId, portfolios.id))
      .innerJoin(profiles, eq(portfolios.profileId, profiles.id))
      .where(eq(portfolioDomains.domain, domain))
      .limit(1);

    return row ?? null;
  }

  async insert(data: {
    portfolioId: string;
    domain: string;
    status?: string;
    statusMessage?: string | null;
  }) {
    const [row] = await db
      .insert(portfolioDomains)
      .values({
        portfolioId: data.portfolioId,
        domain: data.domain,
        status: data.status ?? "pending",
        statusMessage: data.statusMessage ?? null,
      })
      .returning();
    return row;
  }

  async updateByPortfolioId(
    portfolioId: string,
    patch: Partial<{
      domain: string;
      status: string;
      statusMessage: string | null;
      verifiedAt: string | null;
    }>,
  ) {
    const [row] = await db
      .update(portfolioDomains)
      .set({
        ...patch,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(portfolioDomains.portfolioId, portfolioId))
      .returning();
    return row ?? null;
  }

  async deleteByPortfolioId(portfolioId: string) {
    await db
      .delete(portfolioDomains)
      .where(eq(portfolioDomains.portfolioId, portfolioId));
  }
}

export const portfolioDomainRepository = new PortfolioDomainRepository();