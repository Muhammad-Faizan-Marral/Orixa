import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { polar, POLAR_PRODUCTS } from "@/lib/polar/client";
import {
  BILLING,
  isPremiumActive,
  getPortfolioLimit,
} from "@/constants/billing";
import { profileRepository } from "@/repositories/profile.repository";

export class BillingService {
  async createCheckout(params: {
    userId: string;
    email: string;
    productKey: "monthly" | "yearly";
    successUrl?: string;
  }) {
    const productId = POLAR_PRODUCTS[params.productKey];

    if (!productId) {
      throw new Error(
        `Polar product ID for "${params.productKey}" is not configured.`,
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl:
        params.successUrl ??
        `${appUrl}/dashboard?checkout=success&checkout_id={CHECKOUT_ID}`,
      customerEmail: params.email,
      customerExternalId: params.userId,
      metadata: {
        userId: params.userId,
        productKey: params.productKey,
      },
    });

    return checkout;
  }

  async activatePremium(params: {
    userId: string;
    polarCustomerId?: string | null;
    polarSubscriptionId?: string | null;
    premiumUntil?: string | null;
  }) {
    await profileRepository.update(params.userId, {
      isPremium: true,
      premiumUntil: params.premiumUntil ?? null,
      polarCustomerId: params.polarCustomerId ?? undefined,
      polarSubscriptionId: params.polarSubscriptionId ?? undefined,
    });
  }

  async deactivatePremium(userId: string) {
    await profileRepository.update(userId, {
      isPremium: false,
      premiumUntil: null,
      polarSubscriptionId: null,
    });
  }

  getLimits(profile: { isPremium: boolean; premiumUntil: string | null }) {
    const active = isPremiumActive(profile);
    return {
      isPremium: active,
      portfolioLimit: getPortfolioLimit(active),
    };
  }

  async ensureReferralCode(userId: string, username: string) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) return null;

    if (profile.referralCode) return profile.referralCode;

    const code =
      `${username}-${Math.random().toString(36).slice(2, 7)}`.toLowerCase();

    await profileRepository.update(userId, {
      referralCode: code,
    });

    return code;
  }

  async recordSuccessfulReferral(referrerProfileId: string) {
    const [updated] = await db
      .update(profiles)
      .set({
        successfulReferrals: sql`${profiles.successfulReferrals} + 1`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(profiles.id, referrerProfileId))
      .returning();

    if (!updated) return;

    if (
      updated.successfulReferrals >= BILLING.REFERRALS_FOR_PREMIUM &&
      !isPremiumActive(updated)
    ) {
      const until = new Date();
      until.setDate(until.getDate() + BILLING.REFERRAL_PREMIUM_DAYS);

      await db
        .update(profiles)
        .set({
          isPremium: true,
          premiumUntil: until.toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(profiles.id, referrerProfileId));
    }
  }

  /**
   * Called when a user publishes their first portfolio.
   * Credits the referrer once (idempotent via referralCreditedAt).
   */
  async creditReferralOnFirstPublish(profileId: string) {
    const profile = await profileRepository.findById(profileId);
    if (!profile) return;
    if (!profile.referredBy) return;
    if (profile.referralCreditedAt) return; // already credited

    await profileRepository.updateById(profileId, {
      referralCreditedAt: new Date().toISOString(),
    });

    await this.recordSuccessfulReferral(profile.referredBy);
  }
}

export const billingService = new BillingService();