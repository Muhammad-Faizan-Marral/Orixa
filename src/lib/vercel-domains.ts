const TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;
/** Optional. Personal (solo) Vercel accounts do not need this. */
const TEAM_ID = process.env.VERCEL_TEAM_ID;

function assertConfig() {
  if (!TOKEN || !PROJECT_ID) {
    throw new Error("VERCEL_TOKEN / VERCEL_PROJECT_ID not configured");
  }
}

function apiUrl(path: string) {
  const qs = TEAM_ID ? `?teamId=${encodeURIComponent(TEAM_ID)}` : "";
  return `https://api.vercel.com${path}${qs}`;
}

async function vercelFetch(
  path: string,
  init?: { method?: string; body?: string },
) {
  assertConfig();
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

/* ───────────── Types ───────────── */

export type VercelVerification = {
  type: string;
  domain: string;
  value: string;
  reason?: string;
};

export type VercelDomainResult = {
  name: string;
  apexName?: string;
  verified: boolean;
  verification?: VercelVerification[];
};

export type VercelDomainConfig = {
  misconfigured?: boolean;
  recommendedCNAME?: { rank: number; value: string }[];
  recommendedIPv4?: { rank: number; value: string[] }[];
};

/** One DNS record the user must create at their DNS provider. */
export type DnsRecord = {
  type: string; // "TXT" | "CNAME" | "A"
  host: string; // relative host, e.g. "_vercel", "portfolio", "@"
  value: string;
  purpose: "ownership" | "routing";
};

function toResult(
  data: {
    name?: string;
    apexName?: string;
    verified?: boolean;
    verification?: VercelVerification[];
  } | null | undefined,
  fallbackName = "",
): VercelDomainResult {
  return {
    name: data?.name ?? fallbackName,
    apexName: data?.apexName,
    verified: Boolean(data?.verified),
    verification: data?.verification ?? [],
  };
}

/* ───────────── API calls ───────────── */

/** Add a domain to the project. */
export async function vercelAddDomain(
  domain: string,
): Promise<VercelDomainResult> {
  const { res, data } = await vercelFetch(
    `/v10/projects/${PROJECT_ID}/domains`,
    { method: "POST", body: JSON.stringify({ name: domain }) },
  );

  if (!res.ok) {
    throw new Error(
      data?.error?.message ||
        data?.error?.code ||
        "Failed to add domain on Vercel",
    );
  }
  return toResult(data, domain);
}

/** Read a project domain (includes the ownership challenge if unverified). */
export async function vercelGetDomain(
  domain: string,
): Promise<VercelDomainResult | null> {
  const { res, data } = await vercelFetch(
    `/v9/projects/${PROJECT_ID}/domains/${encodeURIComponent(domain)}`,
  );

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(data?.error?.message || "Failed to get domain from Vercel");
  }
  return toResult(data, domain);
}

/** Ask Vercel to re-check ownership. A failed check is not an exception. */
export async function vercelVerifyDomain(
  domain: string,
): Promise<VercelDomainResult> {
  const { res, data } = await vercelFetch(
    `/v9/projects/${PROJECT_ID}/domains/${encodeURIComponent(domain)}/verify`,
    { method: "POST" },
  );

  if (!res.ok) {
    return { name: domain, verified: false, verification: data?.verification ?? [] };
  }
  return toResult(data, domain);
}

/** DNS health: `misconfigured` + the records Vercel recommends. */
export async function vercelGetDomainConfig(
  domain: string,
): Promise<VercelDomainConfig | null> {
  const { res, data } = await vercelFetch(
    `/v6/domains/${encodeURIComponent(domain)}/config`,
  );
  if (!res.ok) return null;
  return data as VercelDomainConfig;
}

export async function vercelRemoveDomain(domain: string): Promise<void> {
  const { res, data } = await vercelFetch(
    `/v9/projects/${PROJECT_ID}/domains/${encodeURIComponent(domain)}`,
    { method: "DELETE" },
  );
  if (!res.ok && res.status !== 404) {
    throw new Error(data?.error?.message || "Failed to remove domain");
  }
}

/* ───────────── DNS records for the UI ───────────── */

function bestByRank<T extends { rank: number }>(list?: T[]): T | undefined {
  return list && list.length ? [...list].sort((a, b) => a.rank - b.rank)[0] : undefined;
}

/**
 * Builds the exact records the user must add, using real values from Vercel:
 *  - TXT (ownership) only while the domain is not verified
 *  - CNAME (subdomain) or A (apex) for routing
 */
export function buildDnsRecords(
  domain: string,
  vercel: VercelDomainResult,
  config: VercelDomainConfig | null,
): DnsRecord[] {
  const apex =
    vercel.apexName || domain.split(".").slice(-2).join(".");

  const relative = (name: string) =>
    name === apex
      ? "@"
      : name.endsWith(`.${apex}`)
        ? name.slice(0, -(apex.length + 1))
        : name;

  const records: DnsRecord[] = [];

  for (const v of vercel.verification ?? []) {
    records.push({
      type: v.type.toUpperCase(),
      host: relative(v.domain),
      value: v.value,
      purpose: "ownership",
    });
  }

  if (domain === apex) {
    const ip = bestByRank(config?.recommendedIPv4)?.value?.[0] ?? "76.76.21.21";
    records.push({ type: "A", host: "@", value: ip, purpose: "routing" });
  } else {
    const target =
      bestByRank(config?.recommendedCNAME)?.value ?? "cname.vercel-dns.com";
    records.push({
      type: "CNAME",
      host: relative(domain),
      value: target.replace(/\.$/, ""),
      purpose: "routing",
    });
  }

  return records;
}