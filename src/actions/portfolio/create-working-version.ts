"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { portfolioService } from "@/services/portfolio/portfolio.service";

export async function createWorkingPortfolioVersion(portfolioId: string) {
  try {
    await requireUser();
    const profile = await requireProfile();

    const result = await portfolioService.createWorkingPortfolioVersion(
      portfolioId,
      profile.id,
    );

    if (!result) {
      return { success: false as const, message: "Portfolio not found." };
    }

    revalidatePath(`/dashboard/portfolios/${portfolioId}`);
    revalidatePath(`/dashboard/portfolios/${portfolioId}/versions`);
    revalidatePath(`/dashboard/portfolios/${portfolioId}/edit`);

    return { success: true as const, version: result.version };
  } catch (error) {
    console.error("createWorkingPortfolioVersion error:", error);
    return {
      success: false as const,
      message: error instanceof Error ? error.message : "Unable to create portfolio version.",
    };
  }
}
