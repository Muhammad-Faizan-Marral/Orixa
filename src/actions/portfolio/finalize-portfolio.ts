"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { uploadService } from "@/services/profile/upload.service";
import { pickRandomFreeTheme } from "@/themes/pick-random-theme";
import { defaultSelectionForTheme } from "@/themes/lab-helpers";
import {
  updatePortfolioDataSchema,
  type UpdatePortfolioDataInput,
} from "@/validations/portfolio-data.schema";

type ComponentSelection = UpdatePortfolioDataInput["componentSelection"];
type DesignPreferences = UpdatePortfolioDataInput["designPreferences"];

function hasRealSelection(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  return Object.values(value as Record<string, unknown>).some((v) => {
    if (!v || typeof v !== "object") return false;
    const variant = (v as { variant?: unknown }).variant;
    return typeof variant === "string" && variant.length > 0;
  });
}

/** DB JSON → schema-shaped object (safe cast after structure check) */
function asComponentSelection(value: unknown): ComponentSelection | null {
  if (!hasRealSelection(value)) return null;
  return value as ComponentSelection;
}

function asDesignPreferences(value: unknown): DesignPreferences | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  // minimal shape check
  if (
    typeof v.themeMode !== "string" &&
    typeof v.layout !== "string" &&
    typeof v.accentColor !== "string"
  ) {
    // still accept partial saved prefs if any key exists
    if (Object.keys(v).length === 0) return null;
  }
  return value as DesignPreferences;
}

export async function finalizePortfolioAction(input: unknown) {
  try {
    await requireUser();
    const profile = await requireProfile();

    const parsed = updatePortfolioDataSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false as const,
        message: "Invalid portfolio data. Check required fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;

    const portfolio = await portfolioService.getPortfolioForUser(
      data.portfolioId,
      profile.id,
    );

    if (!portfolio) {
      return { success: false as const, message: "Portfolio not found." };
    }

    const existing = await portfolioService.getPortfolioWithData(
      data.portfolioId,
      profile.id,
    );

    const existingData = existing?.data ?? null;

    // Prompt lock
    const existingPrompt = (existingData?.prompt as string | null) ?? "";
    const finalPrompt =
      existingPrompt.trim().length > 0 ? existingPrompt : data.prompt;

    // Existing design from DB?
    const savedSelection = asComponentSelection(
      existingData?.componentSelection,
    );
    const savedPrefs = asDesignPreferences(existingData?.designPreferences);
    const alreadyDesigned = savedSelection !== null;

    let componentSelection: ComponentSelection = data.componentSelection;
    let designPreferences: DesignPreferences = data.designPreferences;
    const usedAi = false;
    let skippedDesign = false;
    let designError: string | undefined;

    if (alreadyDesigned && savedSelection) {
      // EDIT path: keep DB design, do NOT call AI again
      skippedDesign = true;
      componentSelection = savedSelection;
      designPreferences = savedPrefs ?? data.designPreferences;
    } else {
      const theme = pickRandomFreeTheme();
      componentSelection = defaultSelectionForTheme(theme) as ComponentSelection;
      designPreferences = {
        ...data.designPreferences,
        themeId: theme.id,
        designDna: theme.id,
        themeMode: theme.tokens.themeMode,
        accentColor: theme.tokens.accentColor,
        fontFamily: theme.tokens.fontSans,
        sectionVariants: theme.defaults,
      } as DesignPreferences;
    }

    const avatarUrl = (data.avatarUrl ?? "").trim();
    const resumeUrl = (data.resumeUrl ?? "").trim();

    // If the user replaced an uploaded resume, remove the old upload so it
    // does not continue consuming the user's storage quota.
    const existingResumeUrl = (existingData?.resumeUrl ?? "").trim();

    const result = await portfolioService.updatePortfolioData(
      data.portfolioId,
      profile.id,
      {
        ...data,
        avatarUrl,
        resumeUrl,
        prompt: finalPrompt,
        componentSelection,
        designPreferences,
      },
    );

    if (existingResumeUrl && resumeUrl && existingResumeUrl !== resumeUrl) {
      try {
        await uploadService.deleteFileByUrl({
          url: existingResumeUrl,
          profileId: profile.id,
        });
      } catch (cleanupError) {
        // Portfolio save succeeded. Log cleanup failure instead of making the
        // user's successful save look like a failure.
        console.error("old resume cleanup failed:", cleanupError);
      }
    }

    revalidatePath(`/dashboard/portfolios/${data.portfolioId}`);
    revalidatePath(`/dashboard/portfolios/${data.portfolioId}/edit`);

    return {
      success: true as const,
      data: result,
      designMeta: {
        usedAi,
        skippedDesign,
        componentSelection,
        designPreferences,
        errorMessage: designError,
      },
    };
  } catch (error) {
    console.error("finalizePortfolioAction:", error);
    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "Unable to finalize portfolio.",
    };
  }
}
