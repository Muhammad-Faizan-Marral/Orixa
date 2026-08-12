"use server";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { portfolioService } from "@/services/portfolio/portfolio.service";

export async function checkPortfolioSlug(
  slug: string,
  excludePortfolioId?: string,
) {
  try {
    const user = await requireUser();

    const profile = await requireProfile();

    const available =
      await portfolioService.isSlugAvailable(
        profile.id,
        slug,
        excludePortfolioId,
      );

    return {
      success: true,
      available,
      message: available
        ? "Slug is available."
        : "Slug is already in use.",
    };
  } catch {
    return {
      success: false,
      available: false,
      message: "Invalid slug.",
    };
  }
}