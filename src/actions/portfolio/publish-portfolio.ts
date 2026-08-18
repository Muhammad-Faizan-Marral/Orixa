"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { portfolioService } from "@/services/portfolio/portfolio.service";

export async function publishPortfolio(portfolioId: string) {
  try {
    await requireUser();

    const profile = await requireProfile();

    const result = await portfolioService.publishPortfolio(
      portfolioId,
      profile.id,
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/portfolios");
    revalidatePath(`/dashboard/portfolios/${portfolioId}`);

    return {
      success: true,
      portfolio: result.portfolio,
      version: result.version,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to publish portfolio.",
    };
  }
}
