import type { Metadata } from "next";
import Link from "next/link";

import { BlogCard } from "@/components/blog/BlogCard";
import { BlogFooter, BlogHeader } from "@/components/blog/BlogHeader";
import { BLOG_ARTICLES } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical guidance on developer portfolios, presenting your work, and using AI to organize a portfolio.",
  alternates: {
    canonical: "https://www.orixaai.me/blog",
  },
  openGraph: {
    type: "website",
    url: "https://www.orixaai.me/blog",
    title: "OrixaAI Blog — Better portfolios, clearer work",
    description:
      "Practical guidance on developer portfolios, presenting your work, and using AI to organize a portfolio.",
  },
};

export default function BlogPage() {
  const [featuredArticle, ...articles] = BLOG_ARTICLES;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogHeader />
      <main>
        <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-6 sm:pb-14 sm:pt-20">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
              OrixaAI / Journal
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-6xl">
              Better portfolios.
              <br />
              <span className="text-muted-foreground">Clearer work.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-7 text-muted-foreground sm:text-xl sm:leading-8">
              Ideas and practical guidance for developers, designers, students,
              and professionals who want to present their work with clarity.
            </p>
          </div>
        </section>

        {featuredArticle && (
          <section
            aria-labelledby="featured-article-heading"
            className="mx-auto max-w-6xl px-5 pb-14 sm:px-6 sm:pb-20"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-primary" aria-hidden="true" />
              <h2
                id="featured-article-heading"
                className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground"
              >
                Start here
              </h2>
            </div>
            <BlogCard article={featuredArticle} featured />
          </section>
        )}

        <section
          aria-labelledby="latest-articles-heading"
          className="mx-auto max-w-6xl px-5 pb-16 sm:px-6 sm:pb-24"
        >
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-accent">Field notes</p>
              <h2
                id="latest-articles-heading"
                className="mt-2 text-3xl font-semibold tracking-tight text-foreground"
              >
                Explore the guides
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Practical approaches to choosing, explaining, and sharing the
              work you want people to understand.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {articles.map((article) => (
              <BlogCard key={article.slug} article={article} />
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-surface/60">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:px-6 sm:py-16 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-accent">Make it yours</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Your work deserves more than a list of links.
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Bring projects, experience, and profile details together in a
                portfolio you can shape and publish when you are ready.
              </p>
            </div>
            <Link
              href="/auth/signup"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
            >
              Create your portfolio
            </Link>
          </div>
        </section>
      </main>
      <BlogFooter />
    </div>
  );
}
