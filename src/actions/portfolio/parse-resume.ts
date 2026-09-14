"use server";

import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { aiRequestService } from "@/services/portfolio/ai-request.service";
import {
  extractTextFromPdf,
  parseResumeWithGemini,
} from "@/lib/ai/parse-resume";
import { requireUser } from "@/lib/auth/require-user";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export async function parseResumeAction(formData: FormData) {
  try {
    await requireUser();
    const profile = await requireProfile();

    const portfolioId = formData.get("portfolioId");
    const file = formData.get("file");

    if (typeof portfolioId !== "string" || !portfolioId) {
      return { success: false as const, message: "Portfolio ID required." };
    }
    if (!(file instanceof File)) {
      return { success: false as const, message: "Please select a PDF file." };
    }

    const name = (file.name || "").toLowerCase();
    const type = (file.type || "").toLowerCase().trim();

    const looksPdf =
      type === "application/pdf" ||
      type === "application/x-pdf" ||
      type === "application/octet-stream" ||
      type === "binary/octet-stream" ||
      type === "" ||
      name.endsWith(".pdf");

    if (!looksPdf) {
      return {
        success: false as const,
        message: "Only PDF resumes are allowed. Example: resume.pdf",
      };
    }

    if (file.size <= 0 || file.size > MAX_RESUME_BYTES) {
      return {
        success: false as const,
        message:
          file.size <= 0
            ? "File is empty or still downloading. Download from Google Drive first, then upload."
            : `PDF must be 5MB or less. Yours is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      };
    }

    const portfolio = await portfolioService.getPortfolioForUser(
      portfolioId,
      profile.id,
    );

    if (!portfolio) {
      return { success: false as const, message: "Portfolio not found." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1) Extract text
    let rawText = "";
    try {
      rawText = await extractTextFromPdf(buffer);
    } catch (err) {
      return {
        success: false as const,
        message:
          err instanceof Error
            ? err.message
            : "Could not read this PDF. Try a text-based PDF from your device.",
      };
    }

    // 2) Gemini validate + extract
    const parsed = await parseResumeWithGemini(rawText);

    await aiRequestService.recordUsage({
      portfolioId,
      requestType: "resume_parse",
      model: "LLMA",
      inputTokens: parsed.inputTokens,
      outputTokens: parsed.outputTokens,
      latencyMs: parsed.latencyMs,
      status: parsed.isValid ? "success" : "failed",
    });

    if (!parsed.isValid || !parsed.data) {
      return {
        success: false as const,
        message:
          parsed.errorMessage ||
          "Your uploaded resume is not correct or maybe empty.",
      };
    }

    // IMPORTANT: the source resume is temporary for parsing only.
    // Do NOT upload/store it. The browser/server buffer is discarded after
    // this request finishes, while the extracted data is kept in the form.

    // Attach ids for form repeaters
    const withIds = {
      ...parsed.data,
      skills: parsed.data.skills.map((s) => ({
        id: crypto.randomUUID(),
        name: s.name,
        level: s.level ?? "",
      })),
      experience: parsed.data.experience.map((e) => ({
        id: crypto.randomUUID(),
        ...e,
      })),
      projects: parsed.data.projects.map((p) => ({
        id: crypto.randomUUID(),
        title: p.title,
        description: p.description ?? "",
        url: p.url ?? "",
        technologies: p.technologies ?? [],
        imageUrl: "",
      })),
      education: parsed.data.education.map((e) => ({
        id: crypto.randomUUID(),
        ...e,
      })),
      certificates: parsed.data.certificates.map((c) => ({
        id: crypto.randomUUID(),
        ...c,
      })),
    };

    return {
      success: true as const,
      message: "Resume parsed successfully.",
      data: withIds,
    };
  } catch (error) {
    console.error("parseResumeAction:", error);

    return {
      success: false as const,
      message:
        error instanceof Error && error.message.includes("GEMINI_API_KEY")
          ? "LLMA API key is not configured."
          : "Resume cannot be processed. Please try again.",
    };
  }
}
