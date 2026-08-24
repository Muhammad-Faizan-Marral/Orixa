import { z } from "zod";

export const contactFormSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio."),

  visitorName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),

  visitorEmail: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254, "Email is too long."),

  subject: z
    .string()
    .trim()
    .max(200, "Subject is too long.")
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message is too long."),

  // Honeypot
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
