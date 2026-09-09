"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";

const schema = z.object({
  portfolioId: z.string().uuid(),
});

export type ArchivePortfolioState = {
  success: boolean;
  message?: string;
  portfolio?: any;
};

export async function archivePortfolio(
  portfolioId: string,
): Promise<ArchivePortfolioState> {
  const parsed = schema.safeParse({ portfolioId });

  if (!parsed.success) {
    return { success: false, message: "Invalid portfolio ID" };
  }

  try {
    const profile = await requireProfile();

    const portfolio = await portfolioService.archivePortfolio(
      parsed.data.portfolioId,
      profile.id,
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/portfolios");
    revalidatePath(`/dashboard/portfolios/${portfolioId}`);
    revalidatePath(`/${profile.username}`);

    return { success: true, portfolio };
  } catch (error) {
    console.error("[archivePortfolio] Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to archive portfolio.",
    };
  }
}
