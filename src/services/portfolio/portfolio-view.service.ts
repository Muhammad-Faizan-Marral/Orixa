import crypto from "node:crypto";

import { portfolioViewRepository } from "@/repositories/portfolio-view.repository";
import { portfolioRepository } from "@/repositories/portfolio.repository";
import { portfolioEventRepository } from "@/repositories/portfolio-event.repository";
import { normalizeTrafficSource } from "@/lib/analytics/referrer";
import { supabaseAdmin } from "@/lib/supabase/admin";

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
    const portfolio = await portfolioRepository.findByIdAndProfileId(
      portfolioId,
      profileId,
    );
    if (!portfolio) return null;

    const since7 = new Date();
    since7.setDate(since7.getDate() - 7);
    const since30 = new Date();
    since30.setDate(since30.getDate() - 30);

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
    ] = await Promise.all([
      portfolioViewRepository.getTotalViews(portfolioId),
      portfolioViewRepository.getViewsSince(portfolioId, since7.toISOString()),
      portfolioViewRepository.getViewsSince(portfolioId, since30.toISOString()),
      portfolioViewRepository.getUniqueVisitors(portfolioId),
      portfolioViewRepository.getCountryCount(portfolioId),
      portfolioViewRepository.getTopCountries(portfolioId),
      portfolioViewRepository.getTopReferrers(portfolioId),
      portfolioViewRepository.getTopDevices(portfolioId),
      portfolioViewRepository.getViewsByDay(portfolioId, 30),
      portfolioEventRepository.countByType(portfolioId, "project_click"),
      portfolioEventRepository.countByType(portfolioId, "contact_click"),
      portfolioEventRepository.topLabels(portfolioId, "project_click", 5),
      // messages for this portfolio
      supabaseAdmin
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("portfolio_id", portfolioId)
        .then((r) => r.count ?? 0)
        .catch(() => 0),
    ]);

    // normalize sources + percentages
    const sourceMap = new Map<string, number>();
    for (const row of referrers) {
      const name = normalizeTrafficSource(row.referrer);
      sourceMap.set(name, (sourceMap.get(name) ?? 0) + Number(row.views));
    }
    const sourcesTotal =
      [...sourceMap.values()].reduce((a, b) => a + b, 0) || 1;
    const trafficSources = [...sourceMap.entries()]
      .map(([name, views]) => ({
        name,
        views,
        percent: Math.round((views / sourcesTotal) * 100),
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    const topSource = trafficSources[0] ?? null;
    const topCountry = countries[0]?.country ?? null;
    const mostViewedProject = topProjects[0]?.label ?? null;

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
      trafficSources: trafficSources ?? [],
      devices: devices ?? [],
      viewsByDay: viewsByDay ?? [],
      topProjects: topProjects ?? [],
      recentViews:
        (await portfolioViewRepository.getRecentViews(portfolioId)) ?? [],
      insights: {
        topSource,
        mostViewedProject,
        mostActiveCountry: topCountry,
      },
    };
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
