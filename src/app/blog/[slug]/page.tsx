import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogArticle } from "@/components/blog/BlogArticle";
import { BlogFooter, BlogHeader } from "@/components/blog/BlogHeader";
import { BLOG_ARTICLES, BLOG_ARTICLES_BY_SLUG } from "@/content/blog";

const SITE_URL = "https://www.orixaai.me";

export function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = BLOG_ARTICLES_BY_SLUG[slug];

  if (!article) {
    return { title: "Article not found" };
  }

  const url = `${SITE_URL}/blog/${article.slug}`;
  const modifiedAt = article.updatedAt ?? article.publishedAt;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      modifiedTime: modifiedAt,
      authors: ["OrixaAI"],
      siteName: "OrixaAI",
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = BLOG_ARTICLES_BY_SLUG[slug];

  if (!article) notFound();

  const modifiedAt = article.updatedAt ?? article.publishedAt;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: modifiedAt,
    author: {
      "@type": "Organization",
      name: "OrixaAI",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "OrixaAI",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logowithBGandText.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${article.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <BlogArticle article={article} />
      <BlogFooter />
    </div>
  );
}
