"use server";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { portfolioService } from "@/services/portfolio/portfolio.service";
import { aiRequestService } from "@/services/portfolio/ai-request.service";
import { generateAssistedText, type AiAssistField } from "@/lib/ai/generate-content";

export async function generateAiContent(input: {
  portfolioId: string;
  field: AiAssistField;
  currentText: string;
  context?: string;
}) {
  await requireUser();
  const profile = await requireProfile();

  const portfolio = await portfolioService.getPortfolioForUser(
    input.portfolioId,
    profile.id
  );

  if (!portfolio) {
    return { success: false as const, message: "Portfolio not found." };
  }

  try {
    const result = await generateAssistedText({
      field: input.field,
      currentText: input.currentText,
      context: input.context,
    });

    await aiRequestService.recordUsage({
      portfolioId: input.portfolioId,
      requestType: input.field,
      model: "claude-sonnet-4-6",
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      latencyMs: result.latencyMs,
      status: "success",
    });

    return { success: true as const, data: { text: result.text } };
  } catch (error) {
    console.error("generateAiContent:", error);

    await aiRequestService.recordUsage({
      portfolioId: input.portfolioId,
      requestType: input.field,
      model: "claude-sonnet-4-6",
      status: "failed",
    });

    return {
      success: false as const,
      message:
        error instanceof Error && error.message.includes("ANTHROPIC_API_KEY")
          ? "AI features aren't configured yet. Add ANTHROPIC_API_KEY to enable them."
          : "Unable to generate content right now. Please try again.",
    };
  }
}
