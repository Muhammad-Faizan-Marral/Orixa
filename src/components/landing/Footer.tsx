import Link from "next/link";
import Logo from "./Logo";
import NewLogo from "../NewLogo";

const PRODUCT = [
  { href: "/#how", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#samplework", label: "Sample work" },
  { href: "/blog", label: "Blog" },
];

const SOLUTIONS = [
  { href: "/developer-portfolio-builder", label: "Developer portfolio" },
  { href: "/resume-to-portfolio", label: "Resume to portfolio" },
  { href: "/ats-resume-builder", label: "ATS resume builder" },
  { href: "/portfolio-analytics", label: "Portfolio analytics" },
  { href: "/portfolio-templates", label: "Portfolio designs" },
];

const LEGAL = [
  { href: "/auth/login", label: "Log in" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

function Col({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <h4>{title}</h4>
      <ul>
        {items.map((l) => (
          <li key={l.href}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="lp lp-footer">
      <div className="lp-container">
        <div className="lp-footer-grid">
          <div>
            <Link href="/" aria-label="OrixaAI home" className="lp-brand">
              <NewLogo  theme="light"  height={38} priority />
            </Link>
            <p className="lp-footer-note">Portfolio that represents your work.</p>
            <a href="mailto:contact@orixaai.me" className="lp-footer-mail">
              contact@orixaai.me
            </a>
          </div>

          <Col title="Product" items={PRODUCT} />
          <Col title="Solutions" items={SOLUTIONS} />
          <Col title="Legal & account" items={LEGAL} />
        </div>

        <p className="lp-copy">© {new Date().getFullYear()} OrixaAI. All rights reserved.</p>
      </div>
    </footer>
  );
}
