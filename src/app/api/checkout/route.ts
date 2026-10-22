import { NextRequest, NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/require-user";
import { hasSecretDiscount } from "@/lib/server/discount";
import { profileService } from "@/services/profile/profile.service";
import { billingService } from "@/services/billing/billing.service";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const profile = await profileService.getProfile(user.id);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found. Complete onboarding first." },
        { status: 400 },
      );
    }

    const body = await req.json();
    const productKey = body.productKey as "monthly" | "yearly";

    if (!productKey || !["monthly", "yearly"].includes(productKey)) {
      return NextResponse.json(
        { error: "Invalid productKey. Use 'monthly' or 'yearly'." },
        { status: 400 },
      );
    }

    // The landing page promises the secret-code discount on the YEARLY plan only.
    // The signed httpOnly cookie is verified server-side; Polar itself enforces
    // the amount, expiry and redemption limits configured for this discount.
    const discountId =
      productKey === "yearly" &&
      process.env.POLAR_SECRET_DISCOUNT_ID &&
      hasSecretDiscount(req)
        ? process.env.POLAR_SECRET_DISCOUNT_ID
        : undefined;

    const checkout = await billingService.createCheckout({
      userId: user.id,
      email: user.email ?? `${profile.username}@orixa.ai`,
      productKey,
      discountId,
    });

    if (!checkout.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: checkout.url });
  } catch (err: any) {
    console.error("[checkout]", err);
    return NextResponse.json(
      { error: err.message ?? "Checkout failed" },
      { status: 500 },
    );
  }
}