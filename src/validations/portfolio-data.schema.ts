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

const componentSelectionSchema = z.object({
  showHero: z.boolean().default(true),
  showAbout: z.boolean().default(true),
  showSkills: z.boolean().default(true),
  showExperience: z.boolean().default(true),
  showProjects: z.boolean().default(true),
  showEducation: z.boolean().default(true),
  showCertificates: z.boolean().default(true),
  showContact: z.boolean().default(true),
});

const designPreferencesSchema = z.object({
  layout: z.enum(["standard", "wide", "centered"]).default("standard"),
  accentColor: z.string().trim().min(1).max(30).default("#000000"),
  fontFamily: z.string().trim().min(1).max(50).default("Inter"),
  borderRadius: z.enum(["none", "small", "medium", "large"]).default("medium"),
  cardStyle: z.enum(["flat", "bordered", "elevated"]).default("bordered"),
});

const seoSchema = z.object({
  title: z.string().trim().max(70).default(""),
  description: z.string().trim().max(160).default(""),
  keywords: z.array(z.string().trim()).default([]),
  ogImage: z.string().trim().default(""),
  canonicalUrl: z.string().trim().default(""),
  noIndex: z.boolean().default(false),
});

export const updatePortfolioDataSchema = z.object({
  portfolioId: z.string().uuid(),

  headline: z
    .string()
    .trim()
    .max(200)
    .default(""),

  about: z
    .string()
    .trim()
    .max(5000)
    .default(""),

  projects: z
    .array(portfolioProjectSchema)
    .default([]),

  experience: z
    .array(portfolioExperienceSchema)
    .default([]),

  skills: z
    .array(portfolioSkillSchema)
    .default([]),

  education: z
    .array(portfolioEducationSchema)
    .default([]),

  certificates: z
    .array(portfolioCertificateSchema)
    .default([]),

  resumeUrl: z
    .string()
    .trim()
    .default(""),

  theme: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .default("minimal"),

  animations: z
    .boolean()
    .default(true),

  componentSelection:
    componentSelectionSchema.default({}),

  designPreferences:
    designPreferencesSchema.default({}),

  seo:
    seoSchema.default({}),
});
export type UpdatePortfolioDataInput = z.infer<typeof updatePortfolioDataSchema>;
