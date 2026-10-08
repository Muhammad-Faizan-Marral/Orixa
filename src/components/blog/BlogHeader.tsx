import Link from "next/link";
import Logo from "@/components/landing/Logo";

export function BlogHeader() {
  return (
    <header className="border-b border-border bg-background/90">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link href="/" aria-label="OrixaAI home" className="shrink-0">
          <Logo variant="wordmark" height={30} />
        </Link>
        <nav aria-label="Blog navigation" className="flex items-center gap-4 text-sm sm:gap-6">
          <Link href="/blog" className="text-foreground transition hover:text-primary">
            Blog
          </Link>
          <Link
            href="/pricing"
            className="hidden text-muted-foreground transition hover:text-foreground sm:inline"
          >
            Pricing
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
          >
            Build free
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function BlogFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="w-fit transition hover:text-foreground">
          OrixaAI
        </Link>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/blog" className="transition hover:text-foreground">
            Blog
          </Link>
          <Link href="/pricing" className="transition hover:text-foreground">
            Pricing
          </Link>
          <Link href="/terms" className="transition hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="transition hover:text-foreground">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
