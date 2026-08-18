import { z } from "zod";

export const portfolioSlugSchema = z
  .string()
  .trim()
  .min(3, "Slug must be at least 3 characters.")
  .max(50, "Slug must be at most 50 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug can only contain lowercase letters, numbers, and hyphens.",
  );

export const portfolioThemeSchema = z.string().trim().min(1).max(50);

export const createPortfolioSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Portfolio title is required.")
    .max(100, "Portfolio title is too long."),

  slug: portfolioSlugSchema,

  headline: z
    .string()
    .trim()
    .max(200, "Headline is too long.")
    .optional()
    .or(z.literal("")),

  about: z
    .string()
    .trim()
    .max(5000, "About section is too long.")
    .optional()
    .or(z.literal("")),

  theme: portfolioThemeSchema.default("minimal"),
});

export const updatePortfolioSchema = z.object({
  portfolioId: z.string().uuid(),

  title: z
    .string()
    .trim()
    .min(2, "Portfolio title is required.")
    .max(100, "Portfolio title is too long."),

  slug: portfolioSlugSchema,

  headline: z
    .string()
    .trim()
    .max(200, "Headline is too long.")
    .optional()
    .or(z.literal("")),

  about: z
    .string()
    .trim()
    .max(5000, "About section is too long.")
    .optional()
    .or(z.literal("")),

  theme: portfolioThemeSchema.default("minimal"),
});

export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;

export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;
