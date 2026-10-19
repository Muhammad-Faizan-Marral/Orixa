import { isPremiumActive } from "@/constants/billing";
import { normalizeDomain, isValidDomainFormat } from "@/lib/domain";
import {
  vercelAddDomain,
  vercelGetDomain,
  vercelRemoveDomain,
  vercelVerifyDomain,
} from "@/lib/vercel-domains";
import { portfolioDomainRepository } from "@/repositories/portfolio-domain.repository";
import { portfolioRepository } from "@/repositories/portfolio.repository";
import { profileRepository } from "@/repositories/profile.repository";

export class DomainService {
  async getForPortfolio(portfolioId: string, profileId: string) {
    const portfolio = await portfolioRepository.findByIdAndProfileId(
      portfolioId,
      profileId,
    );
    if (!portfolio) throw new Error("Portfolio not found.");
    return portfolioDomainRepository.findByPortfolioId(portfolioId);
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

    // Attach on Vercel
    let vercel;
    try {
      vercel = await vercelAddDomain(domain);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Vercel error";
      throw new Error(msg);
    }

    const row = await portfolioDomainRepository.insert({
      portfolioId: opts.portfolioId,
      domain,
      status: vercel.verified ? "verified" : "pending",
      statusMessage: vercel.verified
        ? null
        : "Waiting for DNS verification (usually 15 minutes–24 hours).",
    });

    if (vercel.verified) {
      await portfolioDomainRepository.updateByPortfolioId(opts.portfolioId, {
        status: "verified",
        verifiedAt: new Date().toISOString(),
        statusMessage: null,
      });
    }

    return {
      domain: row,
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

    const vercel = await vercelGetDomain(row.domain);
    if (!vercel) {
      await portfolioDomainRepository.updateByPortfolioId(portfolioId, {
        status: "error",
        statusMessage: "Domain not found on Vercel. Try removing and adding again.",
      });
      return portfolioDomainRepository.findByPortfolioId(portfolioId);
    }

    if (!vercel.verified) {
      try {
        const verified = await vercelVerifyDomain(row.domain);
        if (verified.verified) {
          await portfolioDomainRepository.updateByPortfolioId(portfolioId, {
            status: "verified",
            verifiedAt: new Date().toISOString(),
            statusMessage: null,
          });
        } else {
          await portfolioDomainRepository.updateByPortfolioId(portfolioId, {
            status: "pending",
            statusMessage:
              "Waiting for DNS verification (usually 15 minutes–24 hours).",
          });
        }
      } catch {
        await portfolioDomainRepository.updateByPortfolioId(portfolioId, {
          status: "pending",
          statusMessage:
            "Waiting for DNS verification (usually 15 minutes–24 hours).",
        });
      }
    } else {
      await portfolioDomainRepository.updateByPortfolioId(portfolioId, {
        status: "verified",
        verifiedAt: row.verifiedAt ?? new Date().toISOString(),
        statusMessage: null,
      });
    }

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