import { eq, isNull, sql } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { polar, POLAR_PRODUCTS } from "@/lib/polar/client";
import {
  BILLING,
  isPremiumActive,
  getPortfolioLimit,
} from "@/constants/billing";
import { profileRepository } from "@/repositories/profile.repository";

type ProductKey = "monthly" | "yearly";

function addBillingPeriod(productKey: ProductKey, from = new Date()) {
  const until = new Date(from);
  if (productKey === "monthly") {
    until.setMonth(until.getMonth() + 1);
  } else {
    until.setFullYear(until.getFullYear() + 1);
  }
  return until.toISOString();
}

function metadataString(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object") return null;
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" ? value : null;
}

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
    if (!params.premiumUntil) {
      throw new Error("Premium activation requires an expiry date.");
    }

    await profileRepository.update(params.userId, {
      isPremium: true,
      premiumUntil: params.premiumUntil,
      polarCustomerId: params.polarCustomerId ?? undefined,
      polarSubscriptionId: params.polarSubscriptionId ?? undefined,
    });
  }

  async activateSuccessfulCheckout(userId: string, checkoutId: string) {
    const checkout = await polar.checkouts.get({ id: checkoutId });
    const checkoutUserId = checkout.externalCustomerId ?? checkout.metadata.userId;

    if (
      checkoutUserId !== userId ||
      (checkout.status !== "succeeded" && checkout.status !== "confirmed")
    ) {
      throw new Error("Checkout is not valid for this account.");
    }

    let premiumUntil: string | null = null;
    if (checkout.subscriptionId) {
      const subscription = await polar.subscriptions.get({
        id: checkout.subscriptionId,
      });
      premiumUntil = subscription.currentPeriodEnd.toISOString();
    }

    const productKey = metadataString(checkout.metadata, "productKey");
    if (!premiumUntil && (productKey === "monthly" || productKey === "yearly")) {
      premiumUntil = addBillingPeriod(productKey);
    }

    if (!premiumUntil) {
      throw new Error("Unable to determine Premium expiry.");
    }

    await this.activatePremium({
      userId,
      polarCustomerId: checkout.customerId,
      polarSubscriptionId: checkout.subscriptionId,
      premiumUntil,
    });
  }

  async deactivatePremium(userId: string) {
    await profileRepository.update(userId, {
      isPremium: false,
      premiumUntil: null,
      polarSubscriptionId: null,
      successfulReferrals: 0,
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
    const referralCreditedAt = profile?.referralCreditedAt;
    console.log("[referral] creditReferralOnFirstPublish", {
      profileId,
      referredBy: profile?.referredBy ?? null,
      referralCreditedAt: referralCreditedAt ?? null,
    });

    if (!profile) return;
    if (!profile.referredBy) {
      console.log("[referral] skip — no referredBy on profile");
      return;
    }
    if (referralCreditedAt) {
      console.log("[referral] skip — already credited");
      return;
    }

    const [claimed] = await db
      .update(profiles)
      .set({
        referralCreditedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(
        sql`${profiles.id} = ${profileId} AND ${isNull(profiles.referralCreditedAt)}`,
      )
      .returning({ id: profiles.id });

    if (!claimed) return;

    await this.recordSuccessfulReferral(profile.referredBy);
    console.log("[referral] credited referrer", profile.referredBy);
  }
}

export const billingService = new BillingService();
