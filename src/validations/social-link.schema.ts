import { z } from "zod";

export const socialLinkSchema = z.object({
  platform: z
    .string()
    .trim()
    .min(1, "Platform is required.")
    .max(50, "Platform is too long."),

  url: z
    .string()
    .trim()
    .url("Please enter a valid URL.")
    .max(500, "URL is too long."),

  displayOrder: z.number().int().min(0).default(0),
});

export const updateSocialLinkSchema = socialLinkSchema.extend({
  id: z.string().uuid(),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;

export type UpdateSocialLinkInput = z.infer<typeof updateSocialLinkSchema>;
