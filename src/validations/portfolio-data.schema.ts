import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal(""));

export const portfolioProjectSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1),
  description: optionalString,
  url: optionalString,
  technologies: z.array(z.string()).default([]),
  imageUrl: optionalString,
});

export const portfolioExperienceSchema = z.object({
  id: z.string(),
  company: z.string().trim().min(1),
  role: z.string().trim().min(1),
  location: optionalString,
  startDate: optionalString,
  endDate: optionalString,
  current: z.boolean().default(false),
  description: optionalString,
});

export const portfolioSkillSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1),
  level: optionalString,
});

export const portfolioEducationSchema = z.object({
  id: z.string(),
  institution: z.string().trim().min(1),
  degree: optionalString,
  field: optionalString,
  startDate: optionalString,
  endDate: optionalString,
  description: optionalString,
});

export const portfolioCertificateSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1),
  issuer: optionalString,
  issueDate: optionalString,
  credentialUrl: optionalString,
});

export const updatePortfolioDataSchema = z.object({
  portfolioId: z.string().uuid(),

  headline: z.string().trim().max(200).default(""),

  about: z.string().trim().max(5000).default(""),

  projects: z.array(portfolioProjectSchema).default([]),

  experience: z.array(portfolioExperienceSchema).default([]),

  skills: z.array(portfolioSkillSchema).default([]),

  education: z.array(portfolioEducationSchema).default([]),

  certificates: z.array(portfolioCertificateSchema).default([]),

  resumeUrl: z.string().trim().default(""),

  theme: z.string().trim().min(1).max(50).default("minimal"),

  animations: z.boolean().default(true),

  componentSelection: z.record(z.string(), z.unknown()).default({}),

  designPreferences: z.record(z.string(), z.unknown()).default({}),

  seo: z.record(z.string(), z.unknown()).default({}),
});

export type UpdatePortfolioDataInput = z.infer<
  typeof updatePortfolioDataSchema
>;
