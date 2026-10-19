const TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const TEAM_ID = process.env.VERCEL_TEAM_ID;

function assertConfig() {
  if (!TOKEN || !PROJECT_ID) {
    throw new Error("VERCEL_TOKEN / VERCEL_PROJECT_ID not configured");
  }
}

function teamQs() {
  return TEAM_ID ? `?teamId=${encodeURIComponent(TEAM_ID)}` : "";
}

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
  configuredBy?: string | null;
  nameservers?: string[];
  serviceType?: string;
  cnames?: string[];
  aValues?: string[];
};

async function vercelFetch(url: string, init?: RequestInit) {
  assertConfig();
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

/** Add domain to project */
export async function vercelAddDomain(
  domain: string,
): Promise<VercelDomainResult> {
  const url = `https://api.vercel.com/v10/projects/${PROJECT_ID}/domains${teamQs()}`;
  const { res, data } = await vercelFetch(url, {
    method: "POST",
    body: JSON.stringify({ name: domain }),
  });

  if (!res.ok) {
    throw new Error(
      data?.error?.message ||
        data?.error?.code ||
        "Failed to add domain on Vercel",
    );
  }

  return {
    name: data.name,
    apexName: data.apexName,
    verified: Boolean(data.verified),
    verification: data.verification ?? [],
  };
}

/** Get project domain (includes verification challenges) */
export async function vercelGetDomain(
  domain: string,
): Promise<VercelDomainResult | null> {
  const url = `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${encodeURIComponent(domain)}${teamQs()}`;
  const { res, data } = await vercelFetch(url);

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(data?.error?.message || "Failed to get domain from Vercel");
  }

  return {
    name: data.name,
    apexName: data.apexName,
    verified: Boolean(data.verified),
    verification: data.verification ?? [],
  };
}

/** Ask Vercel to re-check TXT / ownership */
export async function vercelVerifyDomain(
  domain: string,
): Promise<VercelDomainResult> {
  const url = `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${encodeURIComponent(domain)}/verify${teamQs()}`;
  const { res, data } = await vercelFetch(url, { method: "POST" });

  // 400 often means TXT missing / wrong — not a hard crash
  if (!res.ok) {
    const msg =
      data?.error?.message ||
      data?.error?.code ||
      "Verification not complete yet";
    return {
      name: domain,
      verified: false,
      verification: data?.verification ?? [],

      errorMessage: msg,
    } as VercelDomainResult & { errorMessage?: string };
  }

  return {
    name: data.name,
    apexName: data.apexName,
    verified: Boolean(data.verified),
    verification: data.verification ?? [],
  };
}

/** DNS config health (misconfigured flag) */
export async function vercelGetDomainConfig(
  domain: string,
): Promise<VercelDomainConfig | null> {
  const url = `https://api.vercel.com/v6/domains/${encodeURIComponent(domain)}/config${teamQs()}`;
  const { res, data } = await vercelFetch(url);
  if (!res.ok) return null;
  return data as VercelDomainConfig;
}

export async function vercelRemoveDomain(domain: string): Promise<void> {
  const url = `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${encodeURIComponent(domain)}${teamQs()}`;
  const { res, data } = await vercelFetch(url, { method: "DELETE" });
  if (!res.ok && res.status !== 404) {
    throw new Error(data?.error?.message || "Failed to remove domain");
  }
}

/** Human-readable DNS steps from Vercel verification array + common CNAME */
export function formatDnsInstructions(
  domain: string,
  verification: VercelVerification[] | undefined,
): string {
  const lines: string[] = [];

  if (verification && verification.length > 0) {
    lines.push("Add these records at your DNS provider:");
    for (const v of verification) {
      lines.push(`• ${v.type} | Host: ${v.domain} | Value: ${v.value}`);
    }
  } else {
    // subdomain like testingxyz.work.gd
    const parts = domain.split(".");
    if (parts.length > 2) {
      lines.push(`• CNAME | Host: ${parts[0]} | Value: cname.vercel-dns.com`);
    } else {
      lines.push(`• A | Host: @ | Value: 76.76.21.21`);
      lines.push(`• CNAME | Host: www | Value: cname.vercel-dns.com`);
    }
  }

  lines.push("DNS can take 15 minutes–24 hours. Then click Check status.");
  return lines.join("\n");
}


/**
 * Normalizes a raw domain input (removes protocols, trailing paths, ports, and converts to lowercase).
 */
export function normalizeDomain(rawDomain: string): string {
  if (!rawDomain) return "";
  let domain = rawDomain.trim().toLowerCase();
  
  // Remove protocol if present (http://, https://)
  domain = domain.replace(/^https?:\/\//i, "");
  
  // Remove trailing slashes and paths
  domain = domain.split("/")[0];
  
  // Remove port numbers if any
  domain = domain.split(":")[0];
  
  return domain;
}

/**
 * Validates if the given string is in a valid domain format.
 */
export function isValidDomainFormat(domain: string): boolean {
  if (!domain || typeof domain !== "string") return false;
  
  // Standard domain regex for valid domain names and subdomains
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  
  return domainRegex.test(domain);
}