import Link from "next/link";

import { requireUser } from "@/lib/auth/require-user";
import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";

export default async function PortfoliosPage() {
  const user = await requireUser();
  const profile = await requireProfile();

  const portfolios = await portfolioService.getUserPortfolios(profile.id);

  return (
    <main>
      <header>
        <div>
          <p>Dashboard</p>
          <h1>Portfolios</h1>
        </div>

        <Link href="/dashboard/portfolios/new">Create Portfolio</Link>
      </header>

      {portfolios.length === 0 ? (
        <section>
          <h2>No portfolios found</h2>

          <p>Create your first portfolio.</p>

          <Link href="/dashboard/portfolios/new">Create Portfolio</Link>
        </section>
      ) : (
        <section>
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="space-y-2 rounded border p-4">
              <Link
                href={`/dashboard/portfolios/${portfolio.id}`}
                className="font-medium"
              >
                {portfolio.title}
              </Link>

              <p className="text-sm text-gray-500">@{portfolio.slug}</p>

              <p className="text-sm">Status: {portfolio.status}</p>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
