import { aiRequestRepository } from "@/repositories/ai-request.repository";

import { portfolioRepository } from "@/repositories/portfolio.repository";

export class AiRequestService {
  async recordUsage(data: {
    portfolioId?: string | null;
    requestType: string;
    model: string;
    inputTokens?: number;
    outputTokens?: number;
    estimatedCost?: string;
    latencyMs?: number | null;
    status?: "success" | "failed" | "cancelled";
  }) {
    if (data.portfolioId) {
      const portfolio = await portfolioRepository.findById(data.portfolioId);

      if (!portfolio) {
        throw new Error("Portfolio not found.");
      }
    }

    return aiRequestRepository.create(data);
  }

  async getPortfolioRequests(portfolioId: string, profileId: string) {
    const portfolio = await portfolioRepository.findByIdAndProfileId(
      portfolioId,
      profileId,
    );

    if (!portfolio) {
      return null;
    }

    return aiRequestRepository.findByPortfolioId(portfolioId);
  }
}

export const aiRequestService = new AiRequestService();
