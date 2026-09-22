import type { ThemeSectionProps } from "../../../types";
export function NavbarAlt({ config, profile }: ThemeSectionProps) {
  return (
    <nav className="mx-auto flex max-w-5xl items-center justify-between border-b border-slate-200 px-5 py-5">
      <a href="#hero" className="text-lg font-bold tracking-tight">
        {config.name || profile.fullName || profile.username}
      </a>
      <div className="flex gap-3 text-xs uppercase tracking-widest opacity-60">
        <a href="#projects">Projects</a>
        <a href="#contact">Say hello</a>
      </div>
    </nav>
  );
}
