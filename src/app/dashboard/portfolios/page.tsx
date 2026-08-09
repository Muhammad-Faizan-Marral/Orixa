import Link from "next/link";

import { requireUser } from "@/lib/auth/require-user";
import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";

export default async function PortfoliosPage() {
  const user = await requireUser();
  const profile = await requireProfile(user.id);

  const portfolios = await portfolioService.getUserPortfolios(
    profile.id,
  );

  return (
    <main>
      <header>
        <div>
          <p>Dashboard</p>
          <h1>Portfolios</h1>
        </div>

        <Link href="/dashboard/portfolios/new">
          Create Portfolio
        </Link>
      </header>

      {portfolios.length === 0 ? (
        <section>
          <h2>No portfolios found</h2>

          <p>
            Create your first portfolio.
          </p>

          <Link href="/dashboard/portfolios/new">
            Create Portfolio
          </Link>
        </section>
      ) : (
        <section>
          {portfolios.map((portfolio) => (
            <article key={portfolio.id}>
              <h2>{portfolio.title}</h2>

              <p>
                @{portfolio.slug}
              </p>

              <p>
                {portfolio.status}
              </p>

              <Link
                href={`/dashboard/portfolios/${portfolio.id}`}
              >
                Open Portfolio
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}