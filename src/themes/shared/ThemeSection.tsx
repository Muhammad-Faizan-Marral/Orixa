import Link from "next/link";
import type { ThemeSectionProps } from "../types";

export function ThemeSection({ config, profile, section, tone }: ThemeSectionProps) {
  const items = section === "projects" ? config.projects : section === "experience" ? config.experience : section === "education" ? config.education : section === "certificates" ? config.certificates : section === "skills" ? config.skills : undefined;
  const isDark = tone === "alternate";
  const heading = section === "hero" ? config.headline || "Creative work, clearly presented." : section === "about" ? "About" : section[0].toUpperCase() + section.slice(1);
  const body = section === "about" ? config.about : section === "contact" ? "Let’s make something useful together." : undefined;

  if (section === "navbar") {
    return <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6"><a href="#hero" className="font-semibold">{config.name || profile.fullName || profile.username}</a><div className="flex gap-4 text-sm opacity-70"><a href="#projects">Work</a><a href="#about">About</a><a href="#contact">Contact</a></div></nav>;
  }
  if (section === "footer") {
    return <footer className="mx-auto max-w-6xl border-t border-current/15 px-6 py-10 text-sm opacity-70"><span>{config.name || profile.username}</span>{!profile.isPremium && <span className="float-right">Built with OrixaAi</span>}</footer>;
  }
  return <section id={section} className={`mx-auto max-w-6xl px-6 py-20 ${isDark ? "rounded-3xl bg-black/10" : ""}`}><div className="mb-8 max-w-3xl"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] opacity-60">{section}</p><h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{heading}</h2>{body && <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-8 opacity-75">{body}</p>}</div>{section === "hero" && <p className="max-w-2xl text-lg leading-8 opacity-75">{config.about || "A portfolio shaped around thoughtful work and useful details."}</p>}{section === "contact" && <div className="flex flex-wrap gap-3">{config.linkedinUrl && <Link className="underline" href={config.linkedinUrl}>LinkedIn</Link>}{config.githubUrl && <Link className="underline" href={config.githubUrl}>GitHub</Link>}{config.phone && <span>{config.phone}</span>}</div>}{Array.isArray(items) && <div className="grid gap-4 md:grid-cols-2">{items.map((item, index) => { const record = item as Record<string, unknown>; return <article key={String(record.id || index)} className="border border-current/15 p-5"><h3 className="font-medium">{String(record.title || record.name || record.role || record.degree || record.institution || "Item")}</h3><p className="mt-2 text-sm leading-6 opacity-70">{String(record.description || record.company || record.issuer || record.field || "")}</p>{Array.isArray(record.technologies) && <p className="mt-3 text-xs opacity-60">{record.technologies.join(" · ")}</p>}</article>; })}</div>}</section>;
}
