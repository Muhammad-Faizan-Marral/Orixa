"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { profileService } from "@/services/profile/profile.service";
import { getReferralCodeFromCookie } from "@/lib/referral-server";

import type { CreateProfileInput } from "@/validations/profile.schema";

export type CreateProfileResult = {
  success: boolean;
  message?: string;
  debug?: {
    cookieRef: string | null;
    clientRef: string | null;
    usedRef: string | null;
    referredBySet: boolean;
  };
};

export async function createProfile(
  data: CreateProfileInput,
  clientReferralCode?: string | null,
): Promise<CreateProfileResult> {
  try {
    const user = await requireUser();
    const cookieRef = await getReferralCodeFromCookie();
    const clientRef =
      typeof clientReferralCode === "string" &&
      clientReferralCode.trim().length >= 3
        ? clientReferralCode.toLowerCase().trim()
        : null;

    const referralCode = clientRef || cookieRef;

    console.log("[createProfile] referral sources", {
      cookieRef,
      clientRef,
      used: referralCode,
    });

    const profile = await profileService.createProfile(user.id, data, {
      referralCode,
    });

    revalidatePath("/dashboard");
    revalidatePath("/onboarding");

    return {
      success: true,
      debug: {
        cookieRef,
        clientRef,
        usedRef: referralCode,
        referredBySet: Boolean(profile?.referredBy),
      },
    };
  } catch (error) {
    console.error("[createProfile]", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create profile.",
    };
  }
}