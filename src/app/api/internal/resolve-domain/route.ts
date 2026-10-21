import { NextRequest, NextResponse } from "next/server";
import { portfolioDomainRepository } from "@/repositories/portfolio-domain.repository";
import { normalizeDomain, isAppHost } from "@/lib/domain";
import { isPremiumActive } from "@/constants/billing";


export const revalidate = 60;

export async function GET(req: NextRequest) {
  const host = req.nextUrl.searchParams.get("host") || "";
  const domain = normalizeDomain(host);

  if (!domain || isAppHost(domain)) {
    return NextResponse.json(
      { found: false },
      {
        status: 404,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  }

  const row = await portfolioDomainRepository.resolveHost(domain);
  if (!row || row.portfolioStatus !== "published") {
    return NextResponse.json(
      { found: false },
      {
        status: 404,
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      },
    );
  }

  const premium = isPremiumActive({
    isPremium: row.isPremium,
    premiumUntil: row.premiumUntil,
  });

  if (row.status === "suspended" || (row.status === "verified" && !premium)) {
    return NextResponse.json(
      {
        found: true,
        active: false,
        username: row.username,
        slug: row.slug,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      },
    );
  }

  if (row.status !== "verified") {
    return NextResponse.json(
      { found: false },
      {
        status: 404,
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      },
    );
  }

  return NextResponse.json(
    {
      found: true,
      active: true,
      username: row.username,
      slug: row.slug,
      portfolioId: row.portfolioId,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}