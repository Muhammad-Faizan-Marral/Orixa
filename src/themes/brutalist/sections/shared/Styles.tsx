import { tokens } from "../../tokens";

const css = `
.cin-root{--cin-accent:${tokens.accentColor};--cin-fg:${tokens.foregroundColor};--cin-muted:${tokens.mutedColor};
  --cin-display:'Space Grotesk',Inter,system-ui,sans-serif;--cin-mono:ui-monospace,'JetBrains Mono',SFMono-Regular,Menlo,monospace;
  font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
.cin-root *{box-sizing:border-box}
.cin-display{font-family:var(--cin-display);letter-spacing:-.025em}
.cin-mono{font-family:var(--cin-mono)}

/* ---------- glass panel ---------- */
.cin-panel{position:relative;width:100%;max-height:42vh;overflow-y:auto;border-radius:28px;padding:1.5rem;color:var(--cin-fg);
  background:linear-gradient(155deg,rgba(18,24,66,.74) 0%,rgba(6,9,30,.62) 55%,rgba(6,9,30,.7) 100%);
  border:1px solid rgba(255,255,255,.12);
  -webkit-backdrop-filter:blur(22px) saturate(150%);backdrop-filter:blur(22px) saturate(150%);
  box-shadow:0 40px 90px -30px rgba(0,0,0,.65),0 0 0 1px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.1);
  scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.2) transparent}
.cin-panel::before{content:"";position:absolute;left:1.5rem;right:1.5rem;top:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--cin-accent),transparent);opacity:.9}
.cin-panel::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  background:radial-gradient(120% 60% at 0% 0%,rgba(242,83,70,.10),transparent 60%)}
.cin-panel>*{position:relative;z-index:1}
.cin-panel--wide{max-width:60rem}.cin-panel--narrow{max-width:34rem}
@media(min-width:768px){.cin-panel{padding:1.75rem 2rem;max-height:47vh}.cin-panel--short{max-height:40vh;padding:1.25rem 1.75rem}}

/* ---------- typography ---------- */
.cin-kicker{display:flex;align-items:center;gap:.75rem;margin-bottom:.9rem;font-family:var(--cin-mono);
  font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:var(--cin-muted)}
.cin-kicker b{color:var(--cin-accent);font-weight:600}
.cin-kicker i{flex:0 0 2.5rem;height:1px;background:linear-gradient(90deg,var(--cin-accent),transparent)}
.cin-h2{font-family:var(--cin-display);font-weight:700;letter-spacing:-.03em;line-height:1.02;font-size:clamp(1.9rem,3.6vw,3rem);margin:0;
  background:linear-gradient(180deg,#fff 10%,rgba(255,255,255,.72) 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.cin-muted{color:var(--cin-muted)}
.cin-body{color:rgba(247,243,234,.78);line-height:1.7;font-size:.96rem}

/* ---------- pills, chips, buttons ---------- */
.cin-chip{display:inline-flex;align-items:center;padding:.28rem .7rem;border-radius:999px;font-size:.72rem;font-weight:500;
  color:rgba(247,243,234,.88);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);
  transition:background .2s,border-color .2s}
.cin-chip:hover{background:rgba(255,255,255,.12)}
.cin-btn{display:inline-flex;align-items:center;gap:.5rem;padding:.7rem 1.25rem;border-radius:999px;font-size:.85rem;font-weight:600;
  text-decoration:none;cursor:pointer;transition:transform .2s,box-shadow .25s,background .2s,border-color .2s}
.cin-btn:focus-visible{outline:2px solid #fff;outline-offset:3px}
.cin-btn--solid{color:#fff;background:linear-gradient(135deg,#ff6a5c,var(--cin-accent) 60%,#d93a30);
  box-shadow:0 10px 30px -8px rgba(242,83,70,.75),inset 0 1px 0 rgba(255,255,255,.35)}
.cin-btn--solid:hover{transform:translateY(-2px);box-shadow:0 16px 38px -8px rgba(242,83,70,.9),inset 0 1px 0 rgba(255,255,255,.35)}
.cin-btn--ghost{color:var(--cin-fg);background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.22);
  -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.cin-btn--ghost:hover{background:rgba(255,255,255,.15);transform:translateY(-2px)}
.cin-btn .arr{transition:transform .2s}.cin-btn:hover .arr{transform:translate(2px,-2px)}

/* ---------- cards ---------- */
.cin-card{position:relative;border-radius:18px;padding:1rem 1.1rem;background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.09);transition:transform .25s,background .25s,border-color .25s,box-shadow .25s}
.cin-card:hover{transform:translateY(-3px);background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);
  box-shadow:0 18px 40px -20px var(--glow,rgba(242,83,70,.6))}
.cin-num{font-family:var(--cin-mono);font-size:.68rem;letter-spacing:.14em;color:var(--cin-muted)}
.cin-stat{border-radius:16px;padding:.7rem .85rem;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09)}
.cin-stat dd{font-family:var(--cin-display);font-size:1.6rem;font-weight:700;line-height:1;margin:.25rem 0 0;color:#fff}
.cin-stat dt{font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--cin-muted)}

/* ---------- hero ---------- */
.cin-hero-scrim{position:absolute;inset:-20% -10%;z-index:0;pointer-events:none;
  background:radial-gradient(60% 55% at 35% 50%,rgba(5,8,28,.55),transparent 70%)}
.cin-hero-name{font-family:var(--cin-display);font-weight:700;letter-spacing:-.04em;line-height:.95;font-size:clamp(3rem,7vw,5.5rem);margin:0;
  background:linear-gradient(180deg,#fff 20%,#ffe3d6 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 6px 28px rgba(5,8,28,.55))}
.cin-live{display:inline-flex;align-items:center;gap:.55rem;padding:.4rem .9rem;border-radius:999px;font-size:.7rem;letter-spacing:.2em;
  text-transform:uppercase;font-family:var(--cin-mono);color:#fff;background:rgba(5,8,28,.55);border:1px solid rgba(255,255,255,.18);
  -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.cin-live::before{content:"";width:7px;height:7px;border-radius:50%;background:#4ade80;box-shadow:0 0 0 0 rgba(74,222,128,.7);animation:cin-ping 2s infinite}
@keyframes cin-ping{70%{box-shadow:0 0 0 9px rgba(74,222,128,0)}100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}
.cin-scroll-cue{display:inline-flex;align-items:center;gap:.6rem;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.85);font-family:var(--cin-mono)}
.cin-scroll-cue span{width:22px;height:34px;border-radius:12px;border:1.5px solid rgba(255,255,255,.7);position:relative}
.cin-scroll-cue span::after{content:"";position:absolute;left:50%;top:6px;width:3px;height:7px;margin-left:-1.5px;border-radius:2px;background:#fff;animation:cin-wheel 1.6s infinite}
@keyframes cin-wheel{0%{opacity:1;transform:translateY(0)}80%,100%{opacity:0;transform:translateY(11px)}}

/* ---------- HUD ---------- */
.cin-glass-pill{background:rgba(6,9,30,.6);border:1px solid rgba(255,255,255,.14);
  -webkit-backdrop-filter:blur(18px) saturate(150%);backdrop-filter:blur(18px) saturate(150%);
  box-shadow:0 20px 50px -20px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.08)}
.cin-hud-btn{position:relative;display:flex;align-items:center;gap:.75rem;border:0;background:none;cursor:pointer;color:var(--cin-muted);
  font-size:.74rem;font-weight:500;letter-spacing:.04em;transition:color .2s}
.cin-hud-btn:hover,.cin-hud-btn[data-active="true"]{color:#fff}
.cin-hud-btn:focus-visible{outline:2px solid #fff;outline-offset:2px;border-radius:999px}
.cin-hud-dot{width:10px;height:10px;border-radius:50%;border:1.5px solid currentColor;background:rgba(6,9,30,.9);transition:all .25s;flex:none}
.cin-hud-btn[data-active="true"] .cin-hud-dot{background:var(--cin-accent);border-color:var(--cin-accent);box-shadow:0 0 0 4px rgba(242,83,70,.25),0 0 14px var(--cin-accent);transform:scale(1.15)}
.cin-hud-label{white-space:nowrap;opacity:0;transform:translateX(6px);transition:opacity .2s,transform .2s;pointer-events:none}
.cin-hud-btn:hover .cin-hud-label,.cin-hud-btn[data-active="true"] .cin-hud-label{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.cin-root *{animation:none!important;transition:none!important}}
`;

export function Styles() {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
