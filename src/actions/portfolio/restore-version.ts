"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { portfolioService } from "@/services/portfolio/portfolio.service";

export async function restorePortfolioVersion(
  portfolioId: string,
  version: number,
) {
  await requireUser();

  const profile = await requireProfile();

  if (!Number.isInteger(version) || version < 1) {
    return {
      success: false,
      message: "Invalid portfolio version.",
    };
  }

  try {
    const result = await portfolioService.restorePortfolioVersion(
      portfolioId,
      profile.id,
      version,
    );

    if (!result) {
      return {
        success: false,
        message: "Portfolio or version not found.",
      };
    }

    revalidatePath(`/dashboard/portfolios/${portfolioId}`);
    revalidatePath(`/dashboard/portfolios/${portfolioId}/versions`);
    revalidatePath(`/dashboard/portfolios/${portfolioId}/edit`);
    revalidatePath("/dashboard/portfolios");

    return {
      success: true,
      message: `Version ${version} restored to your draft.`,
    };
  } catch (error) {
    console.error("restorePortfolioVersion error:", error);

    return {
      success: false,
      message: "Unable to restore portfolio version.",
    };
  }
}
