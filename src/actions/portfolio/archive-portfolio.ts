"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { revalidatePublicPortfolio } from "@/lib/cache/portfolio-public";

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

    // CRITICAL: public link must stop serving immediately
    if (portfolio?.slug) {
      revalidatePublicPortfolio(profile.username, portfolio.slug);
    } else {
      revalidatePath(`/${profile.username}`);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/portfolios");
    revalidatePath(`/dashboard/portfolios/${portfolioId}`);
    revalidateTag(`portfolios-${profile.id}`, "max");

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