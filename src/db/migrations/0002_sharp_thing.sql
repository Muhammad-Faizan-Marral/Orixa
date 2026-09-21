ALTER TABLE "profiles" ADD COLUMN "is_premium" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "premium_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "polar_customer_id" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "polar_subscription_id" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "referral_code" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "referred_by" uuid;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "successful_referrals" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_referral_code_key" UNIQUE("referral_code");