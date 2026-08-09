import { z } from "zod";

export const portfolioSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Slug must be at least 3 characters.")
  .max(50, "Slug cannot exceed 50 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug may only contain lowercase letters, numbers and hyphens.",
  );

export const createPortfolioSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Portfolio title is required.")
    .max(100, "Portfolio title cannot exceed 100 characters."),

  slug: portfolioSlugSchema,

  headline: z
    .string()
    .trim()
    .max(150, "Headline cannot exceed 150 characters.")
    .optional()
    .or(z.literal("")),

  about: z
    .string()
    .trim()
    .max(2000, "About cannot exceed 2000 characters.")
    .optional()
    .or(z.literal("")),

  theme: z.string().trim().max(50).optional().or(z.literal("")),
});



export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;
