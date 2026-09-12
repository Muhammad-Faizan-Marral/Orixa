"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { revalidatePublicPortfolio } from "@/lib/cache/portfolio-public";

const unpublishSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio ID"),
});

export type UnpublishPortfolioState = {
  success: boolean;
  message?: string;
  portfolio?: unknown;
};

export async function unpublishPortfolio(
  portfolioId: string,
): Promise<UnpublishPortfolioState> {
  const parsed = unpublishSchema.safeParse({ portfolioId });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid portfolio ID",
    };
  }

  try {
    const profile = await requireProfile();

    const portfolio = await portfolioService.unpublishPortfolio(
      parsed.data.portfolioId,
      profile.id,
    );

    if (portfolio?.slug) {
      revalidatePublicPortfolio(profile.username, portfolio.slug);
    } else {
      revalidatePath(`/${profile.username}`);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/portfolios");
    revalidatePath(`/dashboard/portfolios/${portfolioId}`);

    return {
      success: true,
      portfolio,
    };
  } catch (error) {
    console.error("[unpublishPortfolio] Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to unpublish portfolio.",
    };
  }
}