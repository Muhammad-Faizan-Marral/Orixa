import Link from "next/link";
import type { BlogArticle as BlogArticleType, BlogSection } from "@/content/blog/types";
import { BLOG_ARTICLES } from "@/content/blog";
import { BlogCard } from "./BlogCard";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function ArticleSection({ section }: { section: BlogSection }) {
  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {section.heading}
      </h2>
      {section.paragraphs?.map((paragraph, index) => (
        <p key={index} className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          {paragraph}
        </p>
      ))}
      {section.bullets && (
        <ul className="list-disc space-y-3 pl-6 text-base leading-7 text-muted-foreground marker:text-primary sm:text-lg sm:leading-8">
          {section.bullets.map((bullet, index) => (
            <li key={index} className="pl-1">
              {bullet}
            </li>
          ))}
        </ul>
      )}
      {section.subsections?.map((subsection) => (
        <section key={subsection.heading} className="space-y-4 pt-2">
          <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {subsection.heading}
          </h3>
          {subsection.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
            >
              {paragraph}
            </p>
          ))}
          {subsection.bullets && (
            <ul className="list-disc space-y-3 pl-6 text-base leading-7 text-muted-foreground marker:text-primary sm:text-lg sm:leading-8">
              {subsection.bullets.map((bullet, index) => (
                <li key={index} className="pl-1">
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </section>
  );
}

export function BlogArticle({ article }: { article: BlogArticleType }) {
  const relatedArticles = BLOG_ARTICLES.filter(
    (candidate) => candidate.slug !== article.slug,
  );

  return (
    <>
      <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-8 sm:px-6 sm:pt-12">
        <Link
          href="/blog"
          className="inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <span aria-hidden="true">←</span> Back to Blog
        </Link>

        <article className="mx-auto mt-10 max-w-3xl">
          <header className="border-b border-border pb-8 sm:pb-10">
            <p className="text-sm font-medium text-accent">{article.category}</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-7 text-muted-foreground sm:text-xl sm:leading-8">
              {article.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-subtle-foreground">
              <span>By OrixaAI</span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
              <span aria-hidden="true">·</span>
              <span>{article.readingTime}</span>
            </div>
          </header>

          <div className="space-y-10 py-9 sm:space-y-12 sm:py-12">
            {article.content.map((section) => (
              <ArticleSection key={section.heading} section={section} />
            ))}
          </div>
        </article>

        <section
          aria-labelledby="related-articles-heading"
          className="mx-auto mt-6 max-w-6xl border-t border-border pt-10 sm:mt-10 sm:pt-14"
        >
          <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-accent">Keep exploring</p>
              <h2
                id="related-articles-heading"
                className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                Related articles
              </h2>
            </div>
            <Link
              href="/blog"
              className="w-fit text-sm text-muted-foreground transition hover:text-foreground"
            >
              All articles <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {relatedArticles.map((relatedArticle) => (
              <BlogCard key={relatedArticle.slug} article={relatedArticle} />
            ))}
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:mt-20 sm:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-accent">OrixaAI</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Bring your work together in one portfolio.
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Organize your profile and projects, choose a presentation, and
              publish when you are ready. Review every detail before it goes
              public.
            </p>
            <Link
              href="/auth/signup"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
            >
              Build your portfolio
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
