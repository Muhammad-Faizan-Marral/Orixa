"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";

const schema = z.object({
  portfolioId: z.string().uuid(),
});

export type RestorePortfolioState = {
  success: boolean;
  message?: string;
  portfolio?: any;
};

export async function restorePortfolio(
  portfolioId: string,
): Promise<RestorePortfolioState> {
  const parsed = schema.safeParse({ portfolioId });

  if (!parsed.success) {
    return { success: false, message: "Invalid portfolio ID" };
  }

  try {
    const profile = await requireProfile();

    const portfolio = await portfolioService.restorePortfolio(
      parsed.data.portfolioId,
      profile.id,
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/portfolios");
    revalidatePath(`/dashboard/portfolios/${portfolioId}`);

    return { success: true, portfolio };
  } catch (error) {
    console.error("[restorePortfolio] Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to restore portfolio.",
    };
  }
}