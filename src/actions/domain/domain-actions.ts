"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/require-profile";
import { domainService } from "@/services/domain/domain.service";

export type DomainActionState = {
  success: boolean;
  message: string;
  verification?: { type: string; domain: string; value: string }[];
};

export async function addCustomDomain(
  _prev: DomainActionState,
  formData: FormData,
): Promise<DomainActionState> {
  try {
    const profile = await requireProfile();
    const portfolioId = String(formData.get("portfolioId") || "");
    const rawDomain = String(formData.get("domain") || "");

    const result = await domainService.addDomain({
      portfolioId,
      profileId: profile.id,
      userId: profile.userId,
      rawDomain,
    });

    revalidatePath(`/dashboard/portfolios/${portfolioId}`);

    return {
      success: true,
      message: result.verified
        ? "Domain connected and verified."
        : "Domain added. Update your DNS, then click Check status.",
      verification: result.verification?.map((v) => ({
        type: v.type,
        domain: v.domain,
        value: v.value,
      })),
    };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Failed to add domain.",
    };
  }
}

export async function refreshCustomDomain(
  portfolioId: string,
): Promise<DomainActionState> {
  try {
    const profile = await requireProfile();
    await domainService.refreshStatus(portfolioId, profile.id);
    revalidatePath(`/dashboard/portfolios/${portfolioId}`);
    return { success: true, message: "Status updated." };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Failed to refresh status.",
    };
  }
}

export async function removeCustomDomain(
  portfolioId: string,
): Promise<DomainActionState> {
  try {
    const profile = await requireProfile();
    await domainService.removeDomain(portfolioId, profile.id);
    revalidatePath(`/dashboard/portfolios/${portfolioId}`);
    return { success: true, message: "Domain removed." };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Failed to remove domain.",
    };
  }
}
