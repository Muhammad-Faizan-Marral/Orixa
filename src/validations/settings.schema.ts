import { z } from "zod";

export const updateSettingsSchema = z.object({
  language: z.string().trim().min(2).max(10),

  timezone: z.string().trim().max(100).nullable().optional(),

  publicProfile: z.boolean(),

  emailNotifications: z.boolean(),

  themeMode: z.enum(["light", "dark", "system"]).nullable().optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
