import { FILM_LOOK } from "../../data/mood.config";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300&family=Inter:wght@300;400;500&display=swap";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const css = /* css */ `
[data-theme="cinematic"]{
  --bar:0px; --vis:0; --act-p:0;
  font-family:var(--cin-sans, Inter, system-ui, sans-serif);
  -webkit-font-smoothing:antialiased;
}
@media (min-aspect-ratio:5/4){
  [data-theme="cinematic"][data-letterbox="on"]{ --bar:max(0px, calc((100vh - 100vw / ${FILM_LOOK.aspect}) / 2)); }
}

/* ---------- stacked acts ---------- */
.cin-layer{position:fixed;inset:0;z-index:10;pointer-events:none;}
.cin-act{position:absolute;inset:0;opacity:var(--vis);visibility:hidden;}
.cin-act[data-first]{--vis:1;}
.cin-act[data-active="true"]{visibility:visible;pointer-events:auto;}

/* ---------- shared type ---------- */
.cin-eyebrow{margin:0;font:500 .72rem/1 var(--cin-sans);letter-spacing:.42em;text-transform:uppercase;color:var(--cin-accent);animation:cin-rise 1.4s .2s both;}
.cin-caption,.cin-meta{margin:0;font:300 .8rem/1.6 var(--cin-sans);letter-spacing:.2em;text-transform:uppercase;color:var(--cin-muted);}

/* ---------- title card ---------- */
.cin-card{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:1.2rem;text-align:center;padding:calc(var(--bar) + 2rem) 1.5rem;
  transform:translateY(calc((var(--act-p) - .5) * -4vh));}
.cin-card-title{margin:0;font:300 clamp(2.6rem,8vw,6.5rem)/1 var(--cin-display);letter-spacing:-.01em;text-shadow:0 0 50px color-mix(in srgb,var(--cin-accent) 22%,transparent);}
.cin-rule{width:1px;height:3.5rem;background:linear-gradient(var(--cin-accent),transparent);}

/* ---------- hero (prologue) ---------- */
.cin-hero{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:1.4rem;text-align:center;
  padding:calc(var(--bar) + 3rem) 1.5rem;
  transform:translateY(calc(var(--act-p) * -9vh)) scale(calc(1 + var(--act-p) * .05));
  filter:blur(calc(var(--act-p) * 5px));}
.cin-name{margin:0;font:300 clamp(3.2rem,11vw,9.5rem)/.95 var(--cin-display);letter-spacing:-.01em;
  text-shadow:0 0 60px color-mix(in srgb,var(--cin-accent) 28%,transparent);}
.cin-word{display:inline-block;white-space:nowrap;}
.cin-char{display:inline-block;animation:cin-char 1.7s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(.55s + var(--i) * 48ms);}
.cin-headline{margin:0;max-width:34rem;font:italic 300 clamp(1.1rem,2.2vw,1.6rem)/1.4 var(--cin-display);color:color-mix(in srgb,var(--cin-fg) 82%,transparent);animation:cin-rise 1.6s 1.6s both;}
.cin-meta{animation:cin-rise 1.6s 2s both;}
.cin-hint{position:absolute;left:50%;bottom:calc(var(--bar) + 2.2rem);transform:translateX(-50%);display:grid;justify-items:center;gap:.7rem;
  font:400 .62rem/1 var(--cin-sans);letter-spacing:.4em;text-transform:uppercase;color:var(--cin-muted);
  opacity:clamp(0,calc(1 - var(--act-p) * 9),1);animation:cin-rise 1.6s 2.6s both;}
.cin-hint-line{width:1px;height:2.6rem;background:linear-gradient(var(--cin-accent),transparent);transform-origin:top;animation:cin-pulse 2.4s ease-in-out infinite;}


/* ---------- scroll-revealed pieces (--at = act progress at which it appears) ---------- */
.cin-reveal{--r:clamp(0, calc((var(--act-p) - var(--at, 0)) * 7), 1);opacity:var(--r);transform:translateY(calc((1 - var(--r)) * 18px));}

/* ---------- about (chapter I) ---------- */
.cin-about{position:absolute;inset:0;display:grid;align-content:center;gap:3rem;
  padding:calc(var(--bar) + 4.5rem) clamp(1.5rem,8vw,7rem);}
.cin-about::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(4,8,18,.62),rgba(4,8,18,.2) 55%,transparent);}
@media (min-width:900px){.cin-about{grid-template-columns:minmax(0,38rem) minmax(0,1fr);}}
.cin-about-text{display:grid;gap:1.4rem;align-content:center;text-shadow:0 1px 24px rgba(0,0,0,.45);}
.cin-about-title{margin:0;font:300 clamp(1.1rem,1.8vw,1.4rem)/1.2 var(--cin-sans);letter-spacing:.34em;text-transform:uppercase;color:var(--cin-muted);}
.cin-lead{margin:.4rem 0 0;padding:0;font:italic 300 clamp(1.7rem,3.6vw,3rem)/1.18 var(--cin-display);letter-spacing:-.005em;}
.cin-lead::before{content:"\\201C";color:var(--cin-accent);margin-right:.08em;}
.cin-about-body{display:grid;gap:.9rem;max-width:32rem;font:300 clamp(.92rem,1.1vw,1.02rem)/1.75 var(--cin-sans);color:color-mix(in srgb,var(--cin-fg) 84%,transparent);}
.cin-about-body p{margin:0}
.cin-about-body.is-open{max-height:min(42vh,26rem);overflow:auto;padding-right:.8rem;pointer-events:auto;
  -webkit-mask-image:linear-gradient(transparent,#000 6%,#000 92%,transparent);mask-image:linear-gradient(transparent,#000 6%,#000 92%,transparent);}
.cin-more{justify-self:start;background:none;border:0;padding:.4rem 0;border-bottom:1px solid var(--cin-accent);cursor:pointer;
  font:500 .68rem/1 var(--cin-sans);letter-spacing:.3em;text-transform:uppercase;color:var(--cin-accent);}
.cin-facts{display:flex;gap:2.4rem;margin:.6rem 0 0;padding-top:1.2rem;border-top:1px solid color-mix(in srgb,var(--cin-fg) 18%,transparent);}
.cin-facts div{display:grid;gap:.3rem}
.cin-facts dt{font:400 .6rem/1 var(--cin-sans);letter-spacing:.32em;text-transform:uppercase;color:var(--cin-muted);order:2}
.cin-facts dd{margin:0;font:300 clamp(1.8rem,3vw,2.6rem)/1 var(--cin-display);}

/* vintage photo still */
.cin-still{justify-self:center;margin:0;width:min(21rem,28vw);padding:.7rem .7rem 2.4rem;background:#f1e9dd;border-radius:2px;
  transform:translateY(calc((1 - var(--r)) * 18px)) rotate(-2.2deg);box-shadow:0 30px 70px rgba(0,0,0,.45),0 0 0 1px rgba(0,0,0,.06);}
.cin-still img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;filter:sepia(.28) saturate(.9) contrast(1.04);}
.cin-still figcaption{margin-top:.8rem;text-align:center;font:italic 400 1.05rem/1 var(--cin-display);color:#3a2f27;}
@media (max-width:899px){.cin-still{display:none}}

/* ---------- film layer ---------- */
.cin-film{position:fixed;inset:0;z-index:50;pointer-events:none;overflow:hidden;}
.cin-grain{position:absolute;inset:-12%;background-image:${GRAIN};opacity:${FILM_LOOK.grain};mix-blend-mode:overlay;animation:cin-grain .9s steps(6) infinite;}
.cin-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 52%,#000 130%);opacity:${FILM_LOOK.vignette};}
.cin-flicker{position:absolute;inset:0;background:#000;opacity:0;animation:cin-flicker 7s steps(1) infinite;}
.cin-bar{position:absolute;left:0;right:0;height:var(--bar);background:#000;}
.cin-bar-top{top:0}.cin-bar-bottom{bottom:0}
.cin-hud{position:absolute;left:0;right:0;display:flex;justify-content:space-between;padding:0 clamp(1rem,3vw,2.5rem);
  font:400 .62rem/1 var(--cin-sans);letter-spacing:.28em;text-transform:uppercase;color:color-mix(in srgb,var(--cin-fg) 62%,transparent);font-variant-numeric:tabular-nums;}
.cin-hud-top{top:calc(var(--bar) + 1.1rem)}
.cin-hud-bottom{bottom:calc(var(--bar) + 1.1rem)}
.cin-rec{display:inline-flex;align-items:center;gap:.6rem;}
.cin-rec i{width:.5rem;height:.5rem;border-radius:50%;background:#ff3b30;animation:cin-blink 1.6s steps(1) infinite;}

/* ---------- keyframes ---------- */
@keyframes cin-char{from{opacity:0;filter:blur(14px);transform:translateY(.28em)}to{opacity:1;filter:blur(0);transform:none}}
@keyframes cin-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes cin-pulse{0%,100%{transform:scaleY(.35);opacity:.5}50%{transform:scaleY(1);opacity:1}}
@keyframes cin-blink{0%,60%{opacity:1}61%,100%{opacity:.15}}
@keyframes cin-grain{0%{transform:translate(0,0)}20%{transform:translate(-4%,3%)}40%{transform:translate(3%,-5%)}60%{transform:translate(-5%,-2%)}80%{transform:translate(4%,4%)}100%{transform:translate(0,0)}}
@keyframes cin-flicker{0%,100%{opacity:0}91%{opacity:${FILM_LOOK.flicker}}92%{opacity:0}95%{opacity:${FILM_LOOK.flicker * 1.6}}96%{opacity:0}}

/* ---------- reduced motion ---------- */
@media (prefers-reduced-motion:reduce){
  .cin-grain,.cin-flicker,.cin-rec i,.cin-hint-line,.cin-char,.cin-eyebrow,.cin-headline,.cin-meta,.cin-hint{animation:none!important;}
}
[data-theme="cinematic"][data-motion="reduced"] .cin-grain,
[data-theme="cinematic"][data-motion="reduced"] .cin-flicker,
[data-theme="cinematic"][data-motion="reduced"] .cin-rec i,
[data-theme="cinematic"][data-motion="reduced"] .cin-hint-line,
[data-theme="cinematic"][data-motion="reduced"] .cin-char,
[data-theme="cinematic"][data-motion="reduced"] .cin-eyebrow,
[data-theme="cinematic"][data-motion="reduced"] .cin-headline,
[data-theme="cinematic"][data-motion="reduced"] .cin-meta,
[data-theme="cinematic"][data-motion="reduced"] .cin-hint{animation:none!important;}
`;

/** Theme CSS + fonts. Server component; no JS. */
export function Styles() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href={FONTS} />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}
