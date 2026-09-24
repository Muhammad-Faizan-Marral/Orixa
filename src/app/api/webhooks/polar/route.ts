import { Webhooks } from "@polar-sh/nextjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { billingService } from "@/services/billing/billing.service";

function metadataUserId(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return undefined;
  const userId = (metadata as Record<string, unknown>).userId;
  return typeof userId === "string" ? userId : undefined;
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  onPayload: async (payload) => {
    console.log("[Polar Webhook]", payload.type);
  },

  onOrderPaid: async (payload) => {
    const order = payload.data;
    const userId =
      order.customer?.externalId ||
      metadataUserId(order.metadata);

    if (!userId) {
      console.warn("[Polar] order.paid missing externalId / userId");
      return;
    }

    await billingService.activatePremium({
      userId,
      polarCustomerId: order.customer?.id ?? null,
      polarSubscriptionId: order.subscriptionId,
      premiumUntil: order.subscription?.currentPeriodEnd
        ? order.subscription.currentPeriodEnd.toISOString()
        : null,
    });

    console.log(`[Polar] order.paid → premium activated for user ${userId}`);
  },

  onSubscriptionCreated: async (payload) => {
    const sub = payload.data;
    const userId =
      sub.customer?.externalId ||
      metadataUserId(sub.metadata);

    if (!userId) return;

    await billingService.activatePremium({
      userId,
      polarCustomerId: sub.customer?.id ?? null,
      polarSubscriptionId: sub.id,
      premiumUntil: sub.currentPeriodEnd
        ? new Date(sub.currentPeriodEnd).toISOString()
        : null,
    });

    console.log(`[Polar] subscription.created → ${userId}`);
  },

  onSubscriptionActive: async (payload) => {
    const sub = payload.data;
    const userId =
      sub.customer?.externalId ||
      metadataUserId(sub.metadata);

    if (!userId) return;

    await billingService.activatePremium({
      userId,
      polarCustomerId: sub.customer?.id ?? null,
      polarSubscriptionId: sub.id,
      premiumUntil: sub.currentPeriodEnd
        ? new Date(sub.currentPeriodEnd).toISOString()
        : null,
    });
  },

  onSubscriptionCanceled: async (payload) => {
    const sub = payload.data;
    const userId =
      sub.customer?.externalId ||
      metadataUserId(sub.metadata);

    if (!userId) return;

    if (sub.currentPeriodEnd) {
      await db
        .update(profiles)
        .set({
          premiumUntil: new Date(sub.currentPeriodEnd).toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(profiles.userId, userId));
    }

    console.log(`[Polar] subscription.canceled → ${userId}`);
  },

  onSubscriptionRevoked: async (payload) => {
    const sub = payload.data;
    const userId =
      sub.customer?.externalId ||
      metadataUserId(sub.metadata);

    if (!userId) return;

    await billingService.deactivatePremium(userId);
    console.log(`[Polar] subscription.revoked → premium removed for ${userId}`);
  },
});