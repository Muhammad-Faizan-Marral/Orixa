import Link from "next/link";
import Logo from "../landing/Logo";

const POINTS = [
  "Multiple portfolios from one profile",
  "AI-assisted content, reviewed by you",
  "Versioned publishing — nothing breaks live",
];

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      className="grid min-h-screen lg:grid-cols-2"
      style={{ ["--font-display" as string]: "var(--font-dm), sans-serif" }}
    >
      <div className="relative hidden flex-col justify-between overflow-hidden bg-surface p-10 lg:flex">
        <div
          className="bg-aurora pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
        <div
          className="bg-grain pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
        />

        <div className=" flex">
          <Link
            href="/"
            aria-label="OrixaAI home"
            className="flex shrink-0 items-center"
          >
            <Logo variant="auto" height={100} priority />
          </Link>
        </div>

        <div className="relative z-10 max-w-sm">
          <p className="text-h2 text-balance">
            Your work deserves a website, not a resume attachment.
          </p>
          <ul className="mt-8 space-y-3">
            {POINTS.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-sm text-muted-foreground"
              >
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-ion-soft text-[0.6rem] text-primary">
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-caption relative z-10">
          orixa.ai · portfolios, versioned
        </p>
      </div>

      <div className="flex flex-col items-center justify-center bg-background px-6 py-16">
        <div className="w-full max-w-sm">
          <div className=" flex">
            <Link
              href="/"
              aria-label="OrixaAI home"
              className="mb-8 flex items-center gap-2 lg:hidden "
            >
              <Logo variant="auto" height={100} priority />
            </Link>
          </div>
          <h1 className="text-h2">{title}</h1>
          {subtitle && (
            <p className="text-body mt-2 text-muted-foreground">{subtitle}</p>
          )}

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
