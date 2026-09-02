"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { decideDesignWithGemini } from "@/lib/ai/decide-design";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { aiRequestService } from "@/services/portfolio/ai-request.service";
import { updatePortfolioDataSchema } from "@/validations/portfolio-data.schema";

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
    const existingPrompt = (existing?.data?.prompt as string | null) ?? "";
    const finalPrompt =
      existingPrompt.trim().length > 0 ? existingPrompt : data.prompt;

    const design = await decideDesignWithGemini({
      prompt: finalPrompt,
      headline: data.headline,
      about: data.about,
    });

    if (design.usedAi) {
      await aiRequestService.recordUsage({
        portfolioId: data.portfolioId,
        requestType: "design_decision",
        model: "meta-llama/llama-3.1-8b-instruct",
        inputTokens: design.inputTokens,
        outputTokens: design.outputTokens,
        latencyMs: design.latencyMs,
        status: "success",
      });
    } else if (finalPrompt.trim()) {
      // Prompt tha lekin AI fail → log as failed
      await aiRequestService.recordUsage({
        portfolioId: data.portfolioId,
        requestType: "design_decision",
        model: "meta-llama/llama-3.1-8b-instruct",
        status: "failed",
      });
    }

    // Never invent avatar from profile — empty stays empty
    const avatarUrl = (data.avatarUrl ?? "").trim();

    const result = await portfolioService.updatePortfolioData(
      data.portfolioId,
      profile.id,
      {
        ...data,
        avatarUrl,
        prompt: finalPrompt,
        componentSelection: design.decision.componentSelection,
        designPreferences: design.decision.designPreferences,
      },
    );

    revalidatePath(`/dashboard/portfolios/${data.portfolioId}`);
    revalidatePath(`/dashboard/portfolios/${data.portfolioId}/edit`);

    return {
      success: true as const,
      data: result,
      designMeta: {
        usedAi: design.usedAi,
        componentSelection: design.decision.componentSelection,
        designPreferences: design.decision.designPreferences,
        errorMessage: design.errorMessage,
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
