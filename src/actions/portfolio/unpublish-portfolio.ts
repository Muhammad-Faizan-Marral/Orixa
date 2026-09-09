"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";

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

    // Revalidate tags using profile/cache profile argument
    if (portfolio?.slug) {
      const portfolioTag = `portfolio:${profile.username}:${portfolio.slug}`;
      const userTag = `user:${profile.username}`;

      revalidateTag(portfolioTag, "max");
      revalidateTag(userTag, "max");

      revalidatePath(`/${profile.username}/${portfolio.slug}`);
    }

    revalidatePath(`/${profile.username}`);
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
