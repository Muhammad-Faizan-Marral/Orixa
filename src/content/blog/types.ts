import type { ReactNode } from "react";

export type BlogSubsection = {
  heading: string;
  paragraphs: ReactNode[];
  bullets?: ReactNode[];
};

export type BlogSection = {
  heading: string;
  paragraphs?: ReactNode[];
  bullets?: ReactNode[];
  subsections?: BlogSubsection[];
};

export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  featuredLabel: string;
  content: BlogSection[];
};
