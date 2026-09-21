import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.POLAR_SERVER === "production" ? "production" : "sandbox",
});

export const POLAR_PRODUCTS = {
  monthly: process.env.POLAR_PRODUCT_ID_MONTHLY ?? "",
  yearly: process.env.POLAR_PRODUCT_ID_YEARLY ?? "",
} as const;

export type PolarProductKey = keyof typeof POLAR_PRODUCTS;
