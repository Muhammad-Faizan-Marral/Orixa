"use server";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { portfolioService } from "@/services/portfolio/portfolio.service";
import { aiRequestService } from "@/services/portfolio/ai-request.service";
import { uploadService } from "@/services/profile/upload.service";

import {
  extractTextFromPdf,
  parseResumeWithGemini,
} from "@/lib/ai/parse-resume";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export async function parseResumeAction(formData: FormData) {
  try {
    const user = await requireUser();
    const profile = await requireProfile();

    const portfolioId = formData.get("portfolioId");
    const file = formData.get("file");

    if (typeof portfolioId !== "string" || !portfolioId) {
      return { success: false as const, message: "Portfolio ID required." };
    }

    if (!(file instanceof File)) {
      return { success: false as const, message: "Please select a PDF file." };
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return {
        success: false as const,
        message: "Only PDF resumes are allowed.",
      };
    }

    if (file.size <= 0 || file.size > MAX_RESUME_BYTES) {
      return {
        success: false as const,
        message: `PDF must be between 1 byte and 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      };
    }

    // Some browsers send empty type for PDF — name extension se allow karo
    const looksPdf =
      file.type === "application/pdf" ||
      file.type === "" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!looksPdf) {
      return {
        success: false as const,
        message: "Only PDF resumes are allowed. Example: resume.pdf",
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
    } catch {
      return {
        success: false as const,
        message:
          "PDF read nahi ho saki. File corrupt ho sakti hai — dusri PDF try karein.",
      };
    }

    // 2) Gemini validate + extract
    const parsed = await parseResumeWithGemini(rawText);

    await aiRequestService.recordUsage({
      portfolioId,
      requestType: "resume_parse",
      model: "gemini-3.5-flash-lite",
      inputTokens: parsed.inputTokens,
      outputTokens: parsed.outputTokens,
      latencyMs: parsed.latencyMs,
      status: parsed.isValid ? "success" : "failed",
    });

    if (!parsed.isValid || !parsed.data) {
      return {
        success: false as const,
        message:
          parsed.errorMessage || "Aap ka resume sahi nahi hai ya empty hai.",
      };
    }

    // 3) Upload file to storage (optional but useful for download)
    let resumeUrl = "";
    try {
      const uploaded = await uploadService.uploadFile({
        profileId: profile.id,
        userId: user.id,
        portfolioId,
        type: "resume",
        file,
      });
      resumeUrl = uploaded.url ?? uploaded.upload.url ?? "";
    } catch (err) {
      console.error("resume upload after parse:", err);
      // parse success still return — user form fill ho jaye
    }

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
      resumeUrl,
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
          ? "Gemini API key configure nahi hai."
          : "Resume process nahi ho saki. Dobara try karein.",
    };
  }
}
