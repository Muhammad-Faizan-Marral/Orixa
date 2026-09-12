"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { revalidatePublicPortfolio } from "@/lib/cache/portfolio-public";

const publishSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio ID"),
});

export type PublishPortfolioState = {
  success: boolean;
  message?: string;
  portfolio?: unknown;
  version?: unknown;
};

export async function publishPortfolio(
  portfolioId: string,
): Promise<PublishPortfolioState> {
  const parsed = publishSchema.safeParse({ portfolioId });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid portfolio ID",
    };
  }

  try {
    const profile = await requireProfile();

    const result = await portfolioService.publishPortfolio(
      parsed.data.portfolioId,
      profile.id,
    );

    revalidatePublicPortfolio(profile.username, result.portfolio.slug);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/portfolios");
    revalidatePath(`/dashboard/portfolios/${portfolioId}`);

    return {
      success: true,
      portfolio: result.portfolio,
      version: result.version,
    };
  } catch (error) {
    console.error("[publishPortfolio] Error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to publish portfolio.",
    };
  }
}