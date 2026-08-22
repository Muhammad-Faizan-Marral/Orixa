"use server";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { aiRequestService } from "@/services/portfolio/ai-request.service";

export async function recordAiRequest(input: {
  portfolioId?: string | null;
  requestType: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCost?: string;
  latencyMs?: number | null;
  status?: "success" | "failed" | "cancelled";
}) {
  await requireUser();

  const profile = await requireProfile();

  try {
    if (input.portfolioId) {
      const portfolio = await aiRequestService.getPortfolioRequests(
        input.portfolioId,
        profile.id,
      );

      if (!portfolio) {
        return {
          success: false,
          message: "Portfolio not found.",
        };
      }
    }

    const request = await aiRequestService.recordUsage(input);

    return {
      success: true,
      data: request,
    };
  } catch (error) {
    console.error("recordAiRequest:", error);

    return {
      success: false,
      message: "Unable to record AI request.",
    };
  }
}
