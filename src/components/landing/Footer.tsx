import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 pt-14 pb-0">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-start">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link href="/" aria-label="OrixaAI home" className="inline-block">
              <Logo variant="wordmark" height={28} />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Portfolio that represents your work.
            </p>
          </div>

          {/* Links */}
          <nav
            aria-label="Footer"
            className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground md:justify-end"
          >
            <Link href="/#how" className="transition hover:text-foreground">
              How it works
            </Link>
            <Link href="/#features" className="transition hover:text-foreground">
              Features
            </Link>
            <Link href="/#pricing" className="transition hover:text-foreground">
              Pricing
            </Link>
            <Link href="/blog" className="transition hover:text-foreground">
              Blog
            </Link>
            <Link href="/#samplework" className="transition hover:text-foreground">
              Sample work
            </Link>
            <Link
              href="/developer-portfolio-builder"
              className="transition hover:text-foreground"
            >
              Developer portfolio
            </Link>
            <Link
              href="/resume-to-portfolio"
              className="transition hover:text-foreground"
            >
              Resume to portfolio
            </Link>
            <Link
              href="/ats-resume-builder"
              className="transition hover:text-foreground"
            >
              ATS resume builder
            </Link>
            <Link
              href="/portfolio-analytics"
              className="transition hover:text-foreground"
            >
              Portfolio analytics
            </Link>
            <Link
              href="/portfolio-templates"
              className="transition hover:text-foreground"
            >
              Portfolio designs
            </Link>
            <Link href="/auth/login" className="transition hover:text-foreground">
              Log in
            </Link>
            <Link href="/terms" className="transition hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="transition hover:text-foreground">
              Privacy
            </Link>

            <a
              href="mailto:contact@orixaai.me"
              className="rounded-full border border-border/70 bg-surface/50 px-3.5 py-1 text-sm text-foreground transition hover:border-foreground/30 hover:bg-surface"
            >
              contact@orixaai.me
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} OrixaAI. All rights reserved.
        </p>
      </div>

      {/* Large watermark */}
      <div
        className="pointer-events-none -mb-[0.22em] select-none text-center font-display text-[20vw] font-semibold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgb(120_120_140_/_0.25)] [mask-image:linear-gradient(to_bottom,black_20%,transparent_90%)]"
        aria-hidden="true"
      >
        OrixaAI
      </div>
    </footer>
  );
}