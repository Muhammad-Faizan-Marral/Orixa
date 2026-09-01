import { z } from "zod";

export const portfolioSlugSchema = z
  .string()
  .trim()
  .min(3, "Slug must be at least 3 characters. Example: my-portfolio")
  .max(50, "Slug must be at most 50 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug can only contain lowercase letters, numbers, and hyphens. Example: full-stack-dev",
  );

export const createPortfolioSchema = z.object({
  title: z
    .string()
    .trim()
    .min(
      2,
      "Portfolio title is required (min 2 characters). Example: My Developer Portfolio",
    )
    .max(100, "Portfolio title is too long (max 100 characters)."),

  slug: portfolioSlugSchema,

  headline: z
    .string()
    .trim()
    .max(200, "Headline is too long (max 200 characters).")
    .optional()
    .or(z.literal("")),

  about: z
    .string()
    .trim()
    .max(5000, "About section is too long (max 5000 characters).")
    .optional()
    .or(z.literal("")),
});

export const updatePortfolioSchema = z.object({
  portfolioId: z.string().uuid(),

  title: z
    .string()
    .trim()
    .min(2, "Portfolio title is required (min 2 characters).")
    .max(100, "Portfolio title is too long (max 100 characters)."),

  slug: portfolioSlugSchema,

  headline: z
    .string()
    .trim()
    .max(200, "Headline is too long (max 200 characters).")
    .optional()
    .or(z.literal("")),

  about: z
    .string()
    .trim()
    .max(5000, "About section is too long (max 5000 characters).")
    .optional()
    .or(z.literal("")),
});

export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;
