"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { portfolioEventRepository } from "@/repositories/portfolio-event.repository";
import { portfolioViewRepository } from "@/repositories/portfolio-view.repository";

type Input = {
  portfolioId: string;
  eventType: "project_click" | "contact_click";
  label?: string;
};

export async function recordPortfolioEvent(input: Input) {
  try {
    const exists = await portfolioViewRepository.verifyPortfolioExists(
      input.portfolioId,
    );
    if (!exists || exists.status !== "published") return { success: false };

    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      null;

    const ipHash = ip
      ? crypto.createHash("sha256").update(ip).digest("hex")
      : null;

    await portfolioEventRepository.create({
      portfolioId: input.portfolioId,
      eventType: input.eventType,
      label: input.label ?? null,
      referrer: h.get("referer"),
      country:
        h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || null,
      ipHash,
    });

    return { success: true };
  } catch (e) {
    console.error("recordPortfolioEvent:", e);
    return { success: false };
  }
}