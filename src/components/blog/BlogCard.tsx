import Link from "next/link";
import type { BlogArticle } from "@/content/blog/types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function BlogCard({
  article,
  featured = false,
}: {
  article: BlogArticle;
  featured?: boolean;
}) {
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-border-strong ${
        featured ? "md:grid md:grid-cols-[1fr_.8fr]" : ""
      }`}
    >
      <Link
        href={`/blog/${article.slug}`}
        className={`relative flex min-h-44 flex-col justify-between overflow-hidden border-b border-border bg-surface-2 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          featured ? "md:min-h-full md:border-b-0 md:border-r" : ""
        }`}
        aria-label={`Read: ${article.title}`}
      >
        <div className="relative z-10 flex items-center justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
            {article.category}
          </span>
          <span className="font-mono text-xs text-subtle-foreground">
            ORIXA / FIELD NOTES
          </span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-5 -top-12 h-40 w-40 rounded-full border border-border-strong sm:h-48 sm:w-48"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-1 -top-6 h-28 w-28 rounded-full border border-primary/30 sm:h-36 sm:w-36"
        />
        <div className="relative z-10 mt-8 flex items-end justify-between gap-3">
          <span className="max-w-[15rem] text-balance text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
            {article.featuredLabel}
          </span>
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong text-foreground transition group-hover:border-primary group-hover:text-primary"
          >
            ↗
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readingTime}</span>
        </div>
        <h2 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
          <Link
            href={`/blog/${article.slug}`}
            className="rounded-sm transition group-hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {article.title}
          </Link>
        </h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
          {article.excerpt}
        </p>
        <Link
          href={`/blog/${article.slug}`}
          className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-medium text-foreground transition hover:text-primary"
        >
          Read article <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
