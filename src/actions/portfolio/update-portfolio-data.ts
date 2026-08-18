"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { portfolioService } from "@/services/portfolio/portfolio.service";

import { updatePortfolioDataSchema } from "@/validations/portfolio-data.schema";

export async function updatePortfolioData(input: unknown) {
  try {
    const user = await requireUser();

    const profile = await requireProfile();

    const parsed = updatePortfolioDataSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid portfolio data.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await portfolioService.updatePortfolioData(
      parsed.data.portfolioId,
      profile.id,
      parsed.data,
    );

    if (!result) {
      return {
        success: false,
        message: "Portfolio not found.",
      };
    }

    revalidatePath(`/dashboard/portfolios/${parsed.data.portfolioId}`);

    revalidatePath(`/dashboard/portfolios/${parsed.data.portfolioId}/edit`);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("updatePortfolioData error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update portfolio data.",
    };
  }
}
