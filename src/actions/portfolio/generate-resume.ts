"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { generateResumePdf } from "@/lib/resume/generate-resume-pdf";
import { uploadService } from "@/services/profile/upload.service";
import { PUBLIC_UPLOAD_BUCKET } from "@/features/profile/upload.constants";

export async function generateAndAttachResume(portfolioId: string, previousResumeUrl?: string) {
  try {
    const user = await requireUser();
    const profile = await requireProfile();

    const result = await portfolioService.getPortfolioWithData(
      portfolioId,
      profile.id,
    );

    if (!result) {
      return { success: false as const, message: "Portfolio not found." };
    }

    const d = result.data;
    if (!d) {
      return { success: false as const, message: "No portfolio data yet." };
    }

    const pdfBytes = await generateResumePdf({
      name: (d.name as string) || profile.fullName || "Portfolio",
      headline: (d.headline as string) || undefined,
      about: (d.about as string) || undefined,
      phone: (d.phone as string) || undefined,
      linkedinUrl: (d.linkedinUrl as string) || undefined,
      githubUrl: (d.githubUrl as string) || undefined,
      skills: (d.skills as any[]) || [],
      experience: (d.experience as any[]) || [],
      projects: (d.projects as any[]) || [],
      education: (d.education as any[]) || [],
      certificates: (d.certificates as any[]) || [],
    });

    const path = `portfolios/${user.id}/${portfolioId}/resume/generated-${Date.now()}.pdf`;
    const bucket = PUBLIC_UPLOAD_BUCKET;

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, Buffer.from(pdfBytes), {
        contentType: "application/pdf",
        upsert: true,
        cacheControl: "3600",
      });

    if (error) {
      console.error("generate resume upload:", error);
      return {
        success: false as const,
        message: `Unable to store resume PDF: ${error.message}`,
      };
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

    // Only after the new PDF is safely stored do we remove the previous
    // generated PDF. Uploaded resumes are tracked separately in `uploads`.
    const oldResumeUrl =
      typeof previousResumeUrl === "string" && previousResumeUrl.trim()
        ? previousResumeUrl.trim()
        : typeof d.resumeUrl === "string"
          ? d.resumeUrl.trim()
          : "";
    const previousPrefix = `/storage/v1/object/public/${bucket}/portfolios/${user.id}/${portfolioId}/resume/generated-`;
    if (oldResumeUrl.includes(previousPrefix)) {
      const marker = `/storage/v1/object/public/${bucket}/`;
      const markerIndex = oldResumeUrl.indexOf(marker);
      if (markerIndex >= 0) {
        const previousPath = decodeURIComponent(
          oldResumeUrl.slice(markerIndex + marker.length).split("?")[0],
        );
        if (previousPath.startsWith(`portfolios/${user.id}/${portfolioId}/resume/generated-`)) {
          const { error: cleanupError } = await supabaseAdmin.storage
            .from(bucket)
            .remove([previousPath]);
          if (cleanupError) console.error("old generated resume cleanup:", cleanupError);
        }
      }
    }

    await portfolioService.updatePortfolioData(portfolioId, profile.id, {
      portfolioId,
      name: (d.name as string) || "",
      prompt: (d.prompt as string) || "",
      avatarUrl: (d.avatarUrl as string) || "",
      phone: (d.phone as string) || "",
      linkedinUrl: (d.linkedinUrl as string) || "",
      githubUrl: (d.githubUrl as string) || "",
      headline: (d.headline as string) || "",
      about: (d.about as string) || "",
      projects: (d.projects as any[]) || [],
      experience: (d.experience as any[]) || [],
      skills: (d.skills as any[]) || [],
      education: (d.education as any[]) || [],
      certificates: (d.certificates as any[]) || [],
      resumeUrl: publicUrl,
      theme: (d.theme as string) || "minimal",
      animations: Boolean(d.animations ?? true),
      componentSelection: (d.componentSelection as any) || {},
      designPreferences: (d.designPreferences as any) || {},
      seo: (d.seo as any) || {},
    });

    if (oldResumeUrl && oldResumeUrl !== publicUrl && !oldResumeUrl.includes(previousPrefix)) {
      try {
        await uploadService.deleteFileByUrl({
          url: oldResumeUrl,
          profileId: profile.id,
        });
      } catch (cleanupError) {
        console.error("old uploaded resume cleanup:", cleanupError);
      }
    }

    revalidatePath(`/dashboard/portfolios/${portfolioId}`);
    revalidatePath(`/dashboard/portfolios/${portfolioId}/edit`);

    return {
      success: true as const,
      message: "Resume generated.",
      data: { resumeUrl: publicUrl },
    };
  } catch (error) {
    console.error("generateAndAttachResume:", error);
    return {
      success: false as const,
      message:
        error instanceof Error ? error.message : "Resume generate failed.",
    };
  }
}
