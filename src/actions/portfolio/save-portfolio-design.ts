"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { revalidatePublicPortfolio } from "@/lib/cache/portfolio-public";
import {
  updatePortfolioDataSchema,
  type UpdatePortfolioDataInput,
} from "@/validations/portfolio-data.schema";

type ComponentSelection = UpdatePortfolioDataInput["componentSelection"];
type DesignPreferences = UpdatePortfolioDataInput["designPreferences"];

export type SavePortfolioDesignState = {
  success: boolean;
  message?: string;
  version?: number;
};

/**
 * Saves design only → working version → public/CDN revalidate
 * (same idea as editor save + version).
 */
export async function savePortfolioDesign(input: {
  portfolioId: string;
  componentSelection: ComponentSelection;
  designPreferences: DesignPreferences;
}): Promise<SavePortfolioDesignState> {
  try {
    await requireUser();
    const profile = await requireProfile();
    const { isPremiumActive, isPremiumTheme } =
      await import("@/constants/billing");

    const premium = isPremiumActive({
      isPremium: profile.isPremium ?? false,
      premiumUntil: profile.premiumUntil ?? null,
    });

    const dna = (input.designPreferences?.themeId ?? input.designPreferences?.designDna) as string | undefined;
    if (dna && isPremiumTheme(dna) && !premium) {
      return {
        success: false,
        message:
          "Premium design. Upgrade to apply, or choose a free Design DNA.",
      };
    }
    const existing = await portfolioService.getPortfolioWithData(
      input.portfolioId,
      profile.id,
    );

    if (!existing?.portfolio) {
      return { success: false, message: "Portfolio not found." };
    }

    const d = (existing.data ?? {}) as Record<string, unknown>;

    const merged = {
      portfolioId: input.portfolioId,
      name: (d.name as string) ?? "",
      prompt: (d.prompt as string) ?? "",
      avatarUrl: (d.avatarUrl as string) ?? "",
      phone: (d.phone as string) ?? "",
      linkedinUrl: (d.linkedinUrl as string) ?? "",
      githubUrl: (d.githubUrl as string) ?? "",
      headline: (d.headline as string) ?? "",
      about: (d.about as string) ?? "",
      projects: d.projects ?? [],
      experience: d.experience ?? [],
      skills: d.skills ?? [],
      education: d.education ?? [],
      certificates: d.certificates ?? [],
      resumeUrl: (d.resumeUrl as string) ?? "",
      theme: (d.theme as string) ?? "minimal",
      animations: d.animations !== false,
      componentSelection: input.componentSelection,
      designPreferences: input.designPreferences,
      seo: d.seo ?? {
        title: "",
        description: "",
        keywords: [],
        noIndex: false,
      },
    };

    const parsed = updatePortfolioDataSchema.safeParse(merged);
    if (!parsed.success) {
      return {
        success: false,
        message:
          parsed.error.issues[0]?.message ?? "Invalid design preferences.",
      };
    }

    await portfolioService.updatePortfolioData(
      input.portfolioId,
      profile.id,
      parsed.data,
    );

    const versionResult = await portfolioService.createWorkingPortfolioVersion(
      input.portfolioId,
      profile.id,
    );

    revalidatePath(`/dashboard/portfolios/${input.portfolioId}`);
    revalidatePath(`/dashboard/portfolios/${input.portfolioId}/edit`);
    revalidatePath(`/dashboard/portfolios/${input.portfolioId}/design-lab`);
    revalidatePath(`/dashboard/portfolios/${input.portfolioId}/versions`);
    revalidatePath("/dashboard/portfolios");

    revalidatePublicPortfolio(profile.username, existing.portfolio.slug);

    return {
      success: true,
      message: "Design saved. A new version snapshot was created.",
      version: versionResult?.version?.version,
    };
  } catch (error) {
    console.error("[savePortfolioDesign]", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to save design.",
    };
  }
}
