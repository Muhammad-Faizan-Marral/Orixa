"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import {
  createPortfolioSchema,
  type CreatePortfolioInput,
} from "@/validations/portfolio.schema";

export type CreatePortfolioState = {
  success: boolean;
  message?: string;
  portfolioId?: string;
};

/**
 * No redirect() — client navigates.
 */
export async function createPortfolio(
  data: CreatePortfolioInput,
): Promise<CreatePortfolioState> {
  const parsed = createPortfolioSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid portfolio data.",
    };
  }

  try {
    const profile = await requireProfile();
    const portfolio = await portfolioService.createPortfolio(
      profile.id,
      parsed.data,
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/portfolios");

    return {
      success: true,
      portfolioId: portfolio.id,
    };
  } catch (error) {
    console.error("[createPortfolio] Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create portfolio. Please try again.",
    };
  }
}