import { isPremiumActive } from "@/constants/billing";
import { normalizeDomain, isValidDomainFormat } from "@/lib/domain";
import {
  vercelAddDomain,
  vercelGetDomain,
  vercelRemoveDomain,
  vercelVerifyDomain,
  vercelGetDomainConfig,
  buildDnsRecords,
  type DnsRecord,
  type VercelDomainResult,
} from "@/lib/vercel-domains";
import { portfolioDomainRepository } from "@/repositories/portfolio-domain.repository";
import { portfolioRepository } from "@/repositories/portfolio.repository";
import { profileRepository } from "@/repositories/profile.repository";

type Evaluation = { status: "pending" | "verified"; message: string | null };

export class DomainService {
  async getForPortfolio(portfolioId: string, profileId: string) {
    const portfolio = await portfolioRepository.findByIdAndProfileId(
      portfolioId,
      profileId,
    );
    if (!portfolio) throw new Error("Portfolio not found.");
    return portfolioDomainRepository.findByPortfolioId(portfolioId);
  }

  /** Live DNS records from Vercel. Call only for a domain the caller owns. */
  async getDnsRecords(domain: string): Promise<DnsRecord[]> {
    try {
      const vercel = await vercelGetDomain(domain);
      if (!vercel) return [];
      const config = await vercelGetDomainConfig(domain);
      return buildDnsRecords(domain, vercel, config);
    } catch (e) {
      console.error("[domain] getDnsRecords failed", e);
      return [];
    }
  }

  /** "Live" only when ownership is verified AND DNS points to Vercel. */
  private async evaluate(
    domain: string,
    vercel: VercelDomainResult,
  ): Promise<Evaluation> {
    if (!vercel.verified) {
      return {
        status: "pending",
        message:
          "Ownership is not verified yet. Add the DNS records below, then check status.",
      };
    }

    const config = await vercelGetDomainConfig(domain);
    if (!config) {
      return {
        status: "pending",
        message: "Couldn't check your DNS right now. Try again in a minute.",
      };
    }
    if (config.misconfigured) {
      return {
        status: "pending",
        message:
          "Your DNS isn't pointing to Orixa yet. Add the record below, then check status.",
      };
    }
    return { status: "verified", message: null };
  }

  private async applyStatus(portfolioId: string, result: Evaluation) {
    await portfolioDomainRepository.updateByPortfolioId(
      portfolioId,
      result.status === "verified"
        ? {
            status: "verified",
            verifiedAt: new Date().toISOString(),
            statusMessage: null,
          }
        : { status: "pending", statusMessage: result.message },
    );
  }

  async addDomain(opts: {
    portfolioId: string;
    profileId: string;
    userId: string;
    rawDomain: string;
  }) {
    const profile = await profileRepository.findByUserId(opts.userId);
    if (!profile) throw new Error("Profile not found.");

    if (
      !isPremiumActive({
        isPremium: profile.isPremium,
        premiumUntil: profile.premiumUntil,
      })
    ) {
      throw new Error("Custom domains require an active Premium plan.");
    }

    const portfolio = await portfolioRepository.findByIdAndProfileId(
      opts.portfolioId,
      opts.profileId,
    );
    if (!portfolio) throw new Error("Portfolio not found.");
    if (portfolio.status !== "published") {
      throw new Error("Publish the portfolio before attaching a custom domain.");
    }

    const domain = normalizeDomain(opts.rawDomain);
    if (!isValidDomainFormat(domain)) {
      throw new Error("Enter a valid domain (e.g. faizan.co).");
    }

    const existing = await portfolioDomainRepository.findByPortfolioId(
      opts.portfolioId,
    );
    if (existing) {
      throw new Error(
        "This portfolio already has a domain. Remove it before adding a new one.",
      );
    }

    const taken = await portfolioDomainRepository.findByDomain(domain);
    if (taken) {
      throw new Error("This domain is already connected to another portfolio.");
    }

    // Attach on Vercel (throws Vercel's own message on failure)
    const vercel = await vercelAddDomain(domain);

    await portfolioDomainRepository.insert({
      portfolioId: opts.portfolioId,
      domain,
      status: "pending",
      statusMessage: "Add the DNS records below, then check status.",
    });

    await this.applyStatus(opts.portfolioId, await this.evaluate(domain, vercel));

    return {
      domain: await portfolioDomainRepository.findByPortfolioId(opts.portfolioId),
      verification: vercel.verification ?? [],
      verified: Boolean(vercel.verified),
    };
  }

  async refreshStatus(portfolioId: string, profileId: string) {
    const portfolio = await portfolioRepository.findByIdAndProfileId(
      portfolioId,
      profileId,
    );
    if (!portfolio) throw new Error("Portfolio not found.");

    const row = await portfolioDomainRepository.findByPortfolioId(portfolioId);
    if (!row) throw new Error("No domain configured.");

    let vercel = await vercelGetDomain(row.domain);

    if (!vercel) {
      await portfolioDomainRepository.updateByPortfolioId(portfolioId, {
        status: "error",
        statusMessage: "Domain not found on Vercel. Remove it and add it again.",
      });
      return portfolioDomainRepository.findByPortfolioId(portfolioId);
    }

    // Not verified yet → ask Vercel to re-check the TXT record
    if (!vercel.verified) {
      const attempt = await vercelVerifyDomain(row.domain);
      vercel = {
        ...vercel,
        verified: attempt.verified,
        verification: attempt.verification?.length
          ? attempt.verification
          : vercel.verification,
      };
    }

    await this.applyStatus(portfolioId, await this.evaluate(row.domain, vercel));
    return portfolioDomainRepository.findByPortfolioId(portfolioId);
  }

  async removeDomain(portfolioId: string, profileId: string) {
    const portfolio = await portfolioRepository.findByIdAndProfileId(
      portfolioId,
      profileId,
    );
    if (!portfolio) throw new Error("Portfolio not found.");

    const row = await portfolioDomainRepository.findByPortfolioId(portfolioId);
    if (!row) return;

    try {
      await vercelRemoveDomain(row.domain);
    } catch (e) {
      console.error("[domain] vercel remove failed", e);
    }

    await portfolioDomainRepository.deleteByPortfolioId(portfolioId);
  }

  /** Call when premium expires — keep row, stop serving custom host */
  async suspendForProfile(profileId: string) {
    const list = await portfolioRepository.findByProfileId(profileId);
    for (const p of list) {
      const d = await portfolioDomainRepository.findByPortfolioId(p.id);
      if (d && d.status === "verified") {
        await portfolioDomainRepository.updateByPortfolioId(p.id, {
          status: "suspended",
          statusMessage: "Custom domain paused — Premium inactive.",
        });
      }
    }
  }
}

export const domainService = new DomainService();