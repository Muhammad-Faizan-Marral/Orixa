const TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const TEAM_ID = process.env.VERCEL_TEAM_ID;

function baseUrl() {
  if (!TOKEN || !PROJECT_ID) {
    throw new Error("VERCEL_TOKEN / VERCEL_PROJECT_ID not configured");
  }
  const team = TEAM_ID ? `?teamId=${TEAM_ID}` : "";
  return `https://api.vercel.com/v10/projects/${PROJECT_ID}/domains${team}`;
}

function teamQuery() {
  return TEAM_ID ? `?teamId=${TEAM_ID}` : "";
}

export type VercelDomainResult = {
  name: string;
  verified: boolean;
  verification?: {
    type: string;
    domain: string;
    value: string;
    reason: string;
  }[];
};

export async function vercelAddDomain(
  domain: string,
): Promise<VercelDomainResult> {
  const res = await fetch(baseUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: domain }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || "Failed to add domain on Vercel");
  }
  return data as VercelDomainResult;
}

export async function vercelGetDomain(
  domain: string,
): Promise<VercelDomainResult | null> {
  const url = `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${encodeURIComponent(domain)}${teamQuery()}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || "Failed to get domain");
  }
  return data as VercelDomainResult;
}

export async function vercelVerifyDomain(
  domain: string,
): Promise<VercelDomainResult> {
  const url = `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${encodeURIComponent(domain)}/verify${teamQuery()}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || "Domain verification failed");
  }
  return data as VercelDomainResult;
}

export async function vercelRemoveDomain(domain: string): Promise<void> {
  const url = `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${encodeURIComponent(domain)}${teamQuery()}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok && res.status !== 404) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message || "Failed to remove domain");
  }
}
