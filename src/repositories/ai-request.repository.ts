import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { aiRequests } from "@/db/schema";

export class AiRequestRepository {
  async create(data: {
    portfolioId?: string | null;
    requestType: string;
    model: string;
    inputTokens?: number;
    outputTokens?: number;
    estimatedCost?: string;
    latencyMs?: number | null;
    status?: "success" | "failed" | "cancelled";
  }) {
    const [result] = await db
      .insert(aiRequests)
      .values({
        portfolioId: data.portfolioId ?? null,

        requestType: data.requestType,

        model: data.model,

        inputTokens: data.inputTokens ?? 0,

        outputTokens: data.outputTokens ?? 0,

        estimatedCost: data.estimatedCost ?? "0",

        latencyMs: data.latencyMs ?? null,

        status: data.status ?? "success",
      })
      .returning();

    return result;
  }

  async findByPortfolioId(portfolioId: string) {
    return db
      .select()
      .from(aiRequests)
      .where(eq(aiRequests.portfolioId, portfolioId))
      .orderBy(desc(aiRequests.createdAt));
  }
}

export const aiRequestRepository = new AiRequestRepository();
