import Link from "next/link";
import { notFound } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { aiRequestService } from "@/services/portfolio/ai-request.service";

type Props = {
  params: Promise<{
    portfolioId: string;
  }>;
};

export default async function AiUsagePage({ params }: Props) {
  await requireUser();

  const profile = await requireProfile();

  const { portfolioId } = await params;

  const requests = await aiRequestService.getPortfolioRequests(
    portfolioId,
    profile.id,
  );

  if (!requests) {
    notFound();
  }

  const totalInput = requests.reduce(
    (sum, item) => sum + Number(item.inputTokens ?? 0),
    0,
  );

  const totalOutput = requests.reduce(
    (sum, item) => sum + Number(item.outputTokens ?? 0),
    0,
  );

  const totalCost = requests.reduce(
    (sum, item) => sum + Number(item.estimatedCost ?? 0),
    0,
  );

  return (
    <main>
      <Link href={`/dashboard/portfolios/${portfolioId}`}>← Portfolio</Link>

      <h1>AI Usage</h1>

      <section>
        <div>
          <span>Requests</span>
          <strong>{requests.length}</strong>
        </div>

        <div>
          <span>Input Tokens</span>
          <strong>{totalInput}</strong>
        </div>

        <div>
          <span>Output Tokens</span>
          <strong>{totalOutput}</strong>
        </div>

        <div>
          <span>Estimated Cost</span>
          <strong>{totalCost.toFixed(6)}</strong>
        </div>
      </section>

      <section>
        <h2>Request History</h2>

        {requests.length === 0 ? (
          <p>No AI requests yet.</p>
        ) : (
          <div>
            {requests.map((request) => (
              <article key={request.id}>
                <strong>{request.requestType}</strong>

                <p>Model: {request.model}</p>

                <p>Tokens: {Number(request.totalTokens ?? 0)}</p>

                <p>Status: {request.status}</p>

                <p>Cost: {request.estimatedCost}</p>

                <time>{new Date(request.createdAt).toLocaleString()}</time>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
