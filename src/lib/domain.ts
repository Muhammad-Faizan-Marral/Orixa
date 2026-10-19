const ROOT = (
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "orixaai.me"
).toLowerCase();

/** Strip protocol, path, www → faizan.co */
export function normalizeDomain(input: string): string {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "");
  d = d.split("/")[0] ?? d;
  d = d.split("?")[0] ?? d;
  d = d.replace(/:\d+$/, "");
  if (d.startsWith("www.")) d = d.slice(4);
  return d;
}

export function isValidDomainFormat(domain: string): boolean {
  // simple hostname check
  return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(domain);
}

export function isAppHost(host: string): boolean {
  const h = host.toLowerCase().split(":")[0] ?? host;
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h.endsWith(".vercel.app")) return true;
  if (h === ROOT || h === `www.${ROOT}`) return true;
  return false;
}

export function getRootDomain() {
  return ROOT;
}
