function iconFor(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("github")) return "𝐆";
  if (p.includes("linkedin")) return "in";
  if (p.includes("twitter") || p === "x") return "𝕏";
  if (p.includes("dribbble")) return "◐";
  if (p.includes("behance")) return "Bē";
  return "🔗";
}

export function SocialLinksRow({
  links,
}: {
  links: { id: string; platform: string; url: string }[];
}) {
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="surface-panel flex items-center gap-2 px-3.5 py-2 text-sm transition-colors hover:border-border-strong"
        >
          <span className="text-primary">{iconFor(link.platform)}</span>
          {link.platform}
        </a>
      ))}
    </div>
  );
}
