import type { ThemeSectionProps } from "../../../types";
export function FooterDefault({config,profile}:ThemeSectionProps){return <footer className="mx-auto max-w-6xl border-t border-slate-200 px-6 py-10 text-sm opacity-70"><span>{config.name||profile.username}</span>{!profile.isPremium&&<span className="float-right">Built with OrixaAi</span>}</footer>;}
