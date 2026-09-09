"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import {
  createPortfolioSchema,
  type CreatePortfolioInput,
} from "@/validations/portfolio.schema";

export type CreatePortfolioState = {
  success?: boolean;
  message?: string;
};

export async function createPortfolio(
  data: CreatePortfolioInput,
): Promise<CreatePortfolioState | void> {
  const parsed = createPortfolioSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid portfolio data.",
    };
  }

  const profile = await requireProfile();

  try {
    const portfolio = await portfolioService.createPortfolio(
      profile.id,
      parsed.data,
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/portfolios");

    redirect(`/dashboard/portfolios/${portfolio.id}/edit`);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest?: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

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
