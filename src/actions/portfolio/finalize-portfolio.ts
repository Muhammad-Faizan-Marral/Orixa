"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { decideDesignWithGemini } from "@/lib/ai/decide-design";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { aiRequestService } from "@/services/portfolio/ai-request.service";
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
    let usedAi = false;
    let skippedDesign = false;
    let designError: string | undefined;
    let inputTokens = 0;
    let outputTokens = 0;
    let latencyMs = 0;

    if (alreadyDesigned && savedSelection) {
      // EDIT path: keep DB design, do NOT call AI again
      skippedDesign = true;
      componentSelection = savedSelection;
      designPreferences = savedPrefs ?? data.designPreferences;
    } else {
      // FIRST save: run design AI
      const design = await decideDesignWithGemini({
        prompt: finalPrompt,
        headline: data.headline,
        about: data.about,
      });

      // decideDesign returns typed decision — assign through schema parse for safety
      const designPayload = updatePortfolioDataSchema
        .pick({ componentSelection: true, designPreferences: true })
        .safeParse({
          componentSelection: design.decision.componentSelection,
          designPreferences: design.decision.designPreferences,
        });

      if (designPayload.success) {
        componentSelection = designPayload.data.componentSelection;
        designPreferences = designPayload.data.designPreferences;
      } else {
        // fallback to whatever decideDesign returned (cast once)
        componentSelection = design.decision
          .componentSelection as unknown as ComponentSelection;
        designPreferences = design.decision
          .designPreferences as unknown as DesignPreferences;
      }

      usedAi = design.usedAi;
      designError = design.errorMessage;
      inputTokens = design.inputTokens;
      outputTokens = design.outputTokens;
      latencyMs = design.latencyMs;

      if (design.usedAi) {
        await aiRequestService.recordUsage({
          portfolioId: data.portfolioId,
          requestType: "design_decision",
          model: "meta-llama/llama-3.1-8b-instruct",
          inputTokens,
          outputTokens,
          latencyMs,
          status: "success",
        });
      } else if (finalPrompt.trim()) {
        await aiRequestService.recordUsage({
          portfolioId: data.portfolioId,
          requestType: "design_decision",
          model: "meta-llama/llama-3.1-8b-instruct",
          status: "failed",
        });
      }
    }

    const avatarUrl = (data.avatarUrl ?? "").trim();
    const resumeUrl = (data.resumeUrl ?? "").trim();

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
