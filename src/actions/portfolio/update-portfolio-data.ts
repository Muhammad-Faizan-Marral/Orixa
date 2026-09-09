"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { updatePortfolioDataSchema } from "@/validations/portfolio-data.schema";

const inputSchema = z.object({
  portfolioId: z.string().uuid(),
  data: updatePortfolioDataSchema,
});

export type UpdatePortfolioDataState = {
  success: boolean;
  message?: string;
};

export async function updatePortfolioData(
  portfolioId: string,
  data: unknown,
): Promise<UpdatePortfolioDataState> {
  const parsed = inputSchema.safeParse({ portfolioId, data });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid data",
    };
  }

  try {
    const profile = await requireProfile();

    await portfolioService.updatePortfolioData(
      parsed.data.portfolioId,
      profile.id,
      parsed.data.data,
    );

    // Revalidate both dashboard and public page
    revalidatePath(`/dashboard/portfolios/${portfolioId}`);
    revalidatePath(`/dashboard/portfolios/${portfolioId}/edit`);
    revalidatePath("/dashboard/portfolios");
    revalidatePath(`/${profile.username}`);

    return { success: true };
  } catch (error) {
    console.error("[updatePortfolioData] Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to save portfolio data.",
    };
  }
}
