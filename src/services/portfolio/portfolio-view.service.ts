import crypto from "node:crypto";

import { portfolioViewRepository } from "@/repositories/portfolio-view.repository";
import { portfolioRepository } from "@/repositories/portfolio.repository";

export class PortfolioViewService {
  async recordView(data: {
    portfolioId: string;
    country?: string | null;
    city?: string | null;
    browser?: string | null;
    device?: string | null;
    os?: string | null;
    referrer?: string | null;
    ip?: string | null;
  }) {
    const portfolio = await portfolioViewRepository.verifyPortfolioExists(
      data.portfolioId,
    );

    if (!portfolio) {
      return null;
    }

    // Only published portfolios should receive public analytics.
    if (portfolio.status !== "published") {
      return null;
    }

    const ipHash = data.ip ? this.hashIp(data.ip) : null;

    return portfolioViewRepository.create({
      portfolioId: data.portfolioId,
      country: data.country,
      city: data.city,
      browser: data.browser,
      device: data.device,
      os: data.os,
      referrer: data.referrer,
      ipHash,
    });
  }

  async getAnalytics(portfolioId: string, profileId: string) {
    const portfolio = await portfolioRepository.findByIdAndProfileId( portfolioId, profileId);

    if (!portfolio) { return null; }

    return portfolioViewRepository.getAnalytics(portfolioId);
  }

  private hashIp(ip: string) {
    const secret = process.env.VIEW_HASH_SECRET;

    if (!secret) {
      throw new Error("VIEW_HASH_SECRET is not configured.");
    }

    return crypto.createHmac("sha256", secret).update(ip).digest("hex");
  }
}

export const portfolioViewService = new PortfolioViewService();
