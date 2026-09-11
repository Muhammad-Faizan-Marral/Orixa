import crypto from "node:crypto";

import { portfolioViewRepository } from "@/repositories/portfolio-view.repository";
import { portfolioRepository } from "@/repositories/portfolio.repository";
import { portfolioEventRepository } from "@/repositories/portfolio-event.repository";
import { normalizeTrafficSource } from "@/lib/analytics/referrer";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MS_PER_DAY = 86_400_000;

export class PortfolioViewService {
  private readonly hashSecret = process.env.VIEW_HASH_SECRET;

  async recordView(data: {
    portfolioId: string;
    country?: string | null;
    userAgent?: string | null;
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

    if (!portfolio || portfolio.status !== "published") return null;

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
    const portfolio = await portfolioRepository.findByIdAndProfileId(
      portfolioId,
      profileId,
    );
    if (!portfolio) return null;

    const now = Date.now();
    const since7 = new Date(now - 7 * MS_PER_DAY).toISOString();
    const since30 = new Date(now - 30 * MS_PER_DAY).toISOString();

    const [
      total,
      last7Days,
      last30Days,
      uniqueVisitors,
      countryCount,
      countries,
      referrers,
      devices,
      viewsByDay,
      projectClicks,
      contactClicks,
      topProjects,
      messages,
      recentViews,
    ] = await Promise.all([
      portfolioViewRepository.getTotalViews(portfolioId),
      portfolioViewRepository.getViewsSince(portfolioId, since7),
      portfolioViewRepository.getViewsSince(portfolioId, since30),
      portfolioViewRepository.getUniqueVisitors(portfolioId),
      portfolioViewRepository.getCountryCount(portfolioId),
      portfolioViewRepository.getTopCountries(portfolioId),
      portfolioViewRepository.getTopReferrers(portfolioId),
      portfolioViewRepository.getTopDevices(portfolioId),
      portfolioViewRepository.getViewsByDay(portfolioId, 30),
      portfolioEventRepository.countByType(portfolioId, "project_click"),
      portfolioEventRepository.countByType(portfolioId, "contact_click"),
      portfolioEventRepository.topLabels(portfolioId, "project_click", 5),

      // 👈 Fix: Use async IIFE for clean try/catch
      (async () => {
        try {
          const { count } = await supabaseAdmin
            .from("contact_messages")
            .select("id", { count: "exact", head: true })
            .eq("portfolio_id", portfolioId);
          return count ?? 0;
        } catch {
          return 0;
        }
      })(),

      portfolioViewRepository.getRecentViews(portfolioId),
    ]);

    let sourcesTotal = 0;
    const sourceMap = new Map<string, number>();

    for (const row of referrers) {
      const name = normalizeTrafficSource(row.referrer);
      const count = (sourceMap.get(name) ?? 0) + Number(row.views);
      sourceMap.set(name, count);
      sourcesTotal += Number(row.views);
    }

    if (sourcesTotal === 0) sourcesTotal = 1;
    const trafficSources = [...sourceMap.entries()]
      .map(([name, views]) => ({
        name,
        views,
        percent: Math.round((views / sourcesTotal) * 100),
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    return {
      total,
      last7Days,
      last30Days,
      uniqueVisitors,
      countryCount,
      projectClicks,
      contactClicks,
      messages: Number(messages),
      countries: countries ?? [],
      trafficSources,
      devices: devices ?? [],
      viewsByDay: viewsByDay ?? [],
      topProjects: topProjects ?? [],
      recentViews: recentViews ?? [],
      insights: {
        topSource: trafficSources[0] ?? null,
        mostViewedProject: topProjects[0]?.label ?? null,
        mostActiveCountry: countries[0]?.country ?? null,
      },
    };
  }

  private hashIp(ip: string): string {
    if (!this.hashSecret) {
      throw new Error("VIEW_HASH_SECRET is not configured.");
    }
    return crypto
      .createHmac("sha256", this.hashSecret)
      .update(ip)
      .digest("hex");
  }
}

export const portfolioViewService = new PortfolioViewService();
