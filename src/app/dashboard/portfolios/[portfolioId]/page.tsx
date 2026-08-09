import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/require-user";
import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";

type PortfolioPageProps = {
  params: Promise<{
    portfolioId: string;
  }>;
};

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const user = await requireUser();
  const profile = await requireProfile();

  const { portfolioId } = await params;
  const result = await portfolioService.getPortfolioWithData(
    portfolioId,
    profile.id,
  );

  if (!result) {
    notFound();
  }
  const { portfolio, data } = result;
  return (
    <main>
      <Link href="/dashboard/portfolios">← Portfolios</Link>

      <h1>{portfolio.title}</h1>

      <p>@{portfolio.slug}</p>

      <p>Status: {portfolio.status}</p>

      <Link href={`/dashboard/portfolios/${portfolio.id}/edit`}>
        Edit Portfolio
      </Link>
    </main>
  );
}
