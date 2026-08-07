import { z } from "zod";

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username cannot exceed 30 characters.")
  .regex(
    /^[a-z0-9_]+$/,
    "Username may only contain lowercase letters, numbers, and underscores.",
  );

export const createProfileSchema = z.object({
  username: usernameSchema,

  fullName: z.string().trim().max(100).optional().or(z.literal("")),

  headline: z.string().trim().max(150).optional().or(z.literal("")),

  bio: z.string().trim().max(1000).optional().or(z.literal("")),

  location: z.string().trim().max(100).optional().or(z.literal("")),

  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
