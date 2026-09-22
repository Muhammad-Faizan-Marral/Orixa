import type { ThemeSectionProps } from "../../../types";
export function NavbarDefault({ config, profile }: ThemeSectionProps) {
  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <a href="#hero" className="font-semibold">
        {config.name || profile.fullName || profile.username}
      </a>
      <div className="flex gap-4 text-sm opacity-70">
        <a href="#projects">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}
