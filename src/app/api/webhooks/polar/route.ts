import { Webhooks } from "@polar-sh/nextjs";
import { billingService } from "@/services/billing/billing.service";

function metadataUserId(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return undefined;
  const userId = (metadata as Record<string, unknown>).userId;
  return typeof userId === "string" ? userId : undefined;
}

function metadataProductKey(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return null;
  const productKey = (metadata as Record<string, unknown>).productKey;
  return productKey === "monthly" || productKey === "yearly"
    ? productKey
    : null;
}

function addBillingPeriod(productKey: "monthly" | "yearly") {
  const until = new Date();
  if (productKey === "monthly") until.setMonth(until.getMonth() + 1);
  else until.setFullYear(until.getFullYear() + 1);
  return until.toISOString();
}

function resolveUserId(data: {
  customer?: { externalId?: string | null } | null;
  metadata?: unknown;
}) {
  return data.customer?.externalId || metadataUserId(data.metadata) || null;
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  onPayload: async (payload) => {
    console.log("[Polar Webhook]", payload.type);
  },

  onOrderPaid: async (payload) => {
    const order = payload.data;
    const userId = resolveUserId(order);

    if (!userId) {
      console.warn("[Polar] order.paid missing externalId / userId");
      return;
    }

    const premiumUntil = order.subscription?.currentPeriodEnd
      ? new Date(order.subscription.currentPeriodEnd).toISOString()
      : metadataProductKey(order.metadata)
        ? addBillingPeriod(metadataProductKey(order.metadata)!)
        : null;

    if (!premiumUntil) {
      console.error("[Polar] order.paid missing subscription expiry");
      return;
    }

    await billingService.activatePremium({
      userId,
      polarCustomerId: order.customer?.id ?? null,
      polarSubscriptionId: order.subscriptionId ?? null,
      premiumUntil,
    });

    console.log(`[Polar] order.paid → premium activated for user ${userId}`);
  },

  onSubscriptionCreated: async (payload) => {
    const sub = payload.data;
    const userId = resolveUserId(sub);
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
    const userId = resolveUserId(sub);
    if (!userId) return;

    await billingService.activatePremium({
      userId,
      polarCustomerId: sub.customer?.id ?? null,
      polarSubscriptionId: sub.id,
      premiumUntil: sub.currentPeriodEnd
        ? new Date(sub.currentPeriodEnd).toISOString()
        : null,
    });

    console.log(`[Polar] subscription.active → ${userId}`);
  },

  /**
   * Cancel = user ne cancel request ki, lekin period end tak access milta hai.
   * Yahan deactivate MAT karo. Sirf log + optional premiumUntil sync.
   */
  onSubscriptionCanceled: async (payload) => {
    const sub = payload.data;
    const userId = resolveUserId(sub);
    if (!userId) return;

    // Agar Polar currentPeriodEnd bhej raha hai to us tak premium rehne do
    if (sub.currentPeriodEnd) {
      const until = new Date(sub.currentPeriodEnd);
      if (until > new Date()) {
        await billingService.activatePremium({
          userId,
          polarCustomerId: sub.customer?.id ?? null,
          polarSubscriptionId: sub.id,
          premiumUntil: until.toISOString(),
        });
        console.log(
          `[Polar] subscription.canceled → premium kept until ${until.toISOString()} for ${userId}`,
        );
        return;
      }
    }

    // Period already over → deactivate
    await billingService.deactivatePremium(userId);
    console.log(
      `[Polar] subscription.canceled (period ended) → premium removed for ${userId}`,
    );
  },

  /**
   * Revoked = access actually band. Yahan deactivate karo.
   */
  onSubscriptionRevoked: async (payload) => {
    const sub = payload.data;
    const userId = resolveUserId(sub);
    if (!userId) return;

    await billingService.deactivatePremium(userId);
    console.log(`[Polar] subscription.revoked → premium removed for ${userId}`);
  },
});
