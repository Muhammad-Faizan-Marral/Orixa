import Link from "next/link";
import Logo from "./Logo";

export default function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden py-28 md:py-40">
      {/* Soft ambient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/40 opacity-60"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-3xl px-5 text-center">
        {/* Logo badge */}
        <div className="mx-auto mb-10 w-fit overflow-hidden rounded-2xl shadow-[0_0_40px_-8px_rgba(108,92,255,0.35)]">
          <Logo variant="badge" height={72} />
        </div>

        {/* Headline */}
        <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-[3.25rem] md:leading-[1.1]">
          Ready to show your work{" "}
          <span className="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
            the way it deserves?
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
          Create your first portfolio free. No credit card required.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Link
            href="/auth/signup"
            className="btn btn-ion w-full sm:w-auto sm:min-w-[14rem]"
          >
            Build free portfolio
          </Link>
          <Link
            href="#pricing"
            className="btn btn-ghost w-full sm:w-auto sm:min-w-[12rem]"
          >
            View pricing
          </Link>
        </div>
      </div>
    </section>
  );
}