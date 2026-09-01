"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { portfolioService } from "@/services/portfolio/portfolio.service";

import type { CreatePortfolioInput } from "@/validations/portfolio.schema";

export async function createPortfolio(data: CreatePortfolioInput) {
  try {
    await requireUser();
    const profile = await requireProfile();

    const portfolio = await portfolioService.createPortfolio(profile.id, data);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/portfolios");

    // Redrict Edit / Onboarding 
    redirect(`/dashboard/portfolios/${portfolio.id}/edit`);
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to create portfolio.",
    };
  }
}
