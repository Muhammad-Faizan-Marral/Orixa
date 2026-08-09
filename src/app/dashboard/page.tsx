import Link from "next/link";

import { requireUser } from "@/lib/auth/require-user";
import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";

export default async function DashboardPage() {
  const user = await requireUser();
  const profile = await requireProfile();

  const portfolios = await portfolioService.getUserPortfolios(profile.id);

  return (
    <main>
      <header>
        <p>Welcome back</p>

        <h1>{profile.fullName || profile.username}</h1>

        <Link href="/dashboard/portfolios/new">
          Create Portfolio
        </Link>
      </header>

      <section>
        <div>
          <h2>Your Portfolios</h2>

          <p>
            {portfolios.length}{" "}
            {portfolios.length === 1 ? "portfolio" : "portfolios"}
          </p>
        </div>

        {portfolios.length === 0 ? (
          <div>
            <h3>No portfolios yet</h3>

            <p>
              Create your first portfolio to get started.
            </p>

            <Link href="/dashboard/portfolios/new">
              Create your first portfolio
            </Link>
          </div>
        ) : (
          <div>
            {portfolios.map((portfolio) => (
              <article key={portfolio.id}>
                <h3>{portfolio.title}</h3>

                <p>@{portfolio.slug}</p>

                <p>Status: {portfolio.status}</p>

                <Link
                  href={`/dashboard/portfolios/${portfolio.id}`}
                >
                  Open
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}