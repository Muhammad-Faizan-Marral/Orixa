import type { CSSProperties, ReactNode } from "react";

export const muted: CSSProperties = { color: "var(--cin-muted)" };

export function Panel({ children, wide = false, short = false }: { children: ReactNode; wide?: boolean; short?: boolean }) {
  return <div className={`cin-panel ${wide ? "cin-panel--wide" : "cin-panel--narrow"} ${short ? "cin-panel--short" : ""}`}>{children}</div>;
}

/** "03 ── Sky islands" : station number + landmark naam */
export function Kicker({ n, total, children }: { n: number; total: number; children: ReactNode }) {
  const pad = (v: number) => String(v).padStart(2, "0");
  return (
    <p className="cin-kicker">
      <b>{pad(n)}</b>
      <span className="cin-muted">/ {pad(total)}</span>
      <i aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export function Heading({ children }: { children: ReactNode }) {
  return <h2 className="cin-h2">{children}</h2>;
}

export function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span className="cin-chip" style={color ? { borderColor: color } : undefined}>
      {children}
    </span>
  );
}

export function ExtLink({
  href,
  external,
  children,
  solid = false,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
  solid?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`cin-btn ${solid ? "cin-btn--solid" : "cin-btn--ghost"}`}
    >
      {children}
      {external && <span className="arr" aria-hidden>↗</span>}
    </a>
  );
}
