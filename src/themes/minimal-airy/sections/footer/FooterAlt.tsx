import type { ThemeSectionProps } from "../../../types";
export function FooterAlt({config,profile}:ThemeSectionProps){return <footer className="mx-auto max-w-5xl border-t-2 border-slate-900 px-5 py-8 text-xs uppercase tracking-widest"><span>{config.name||profile.username}</span>{!profile.isPremium&&<span className="float-right">Built with OrixaAi</span>}</footer>;}
