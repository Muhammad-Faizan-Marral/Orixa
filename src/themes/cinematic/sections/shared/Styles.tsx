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
/* ---------- projects (chapter III): a reel of frames, driven by --act-p ---------- */
.cin-works{position:absolute;inset:0;
  --t:calc(clamp(0, (var(--act-p) - 0.08) / 0.84, 1) * var(--n));}   /* 0..n : which frame is "in the gate" */
.cin-works::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,5,3,.6),rgba(8,5,3,.15) 60%,transparent);}
.cin-works-head{position:absolute;top:calc(var(--bar) + 3.4rem);left:clamp(1.5rem,8vw,7rem);display:grid;gap:.55rem;z-index:2;}
.cin-works-title{margin:0;font:300 clamp(1.1rem,1.8vw,1.4rem)/1.2 var(--cin-sans);letter-spacing:.34em;text-transform:uppercase;color:var(--cin-muted);}

.cin-frame{position:absolute;inset:0;display:grid;align-content:center;gap:1.6rem;
  padding:calc(var(--bar) + 7.5rem) clamp(1.5rem,8vw,7rem) calc(var(--bar) + 6.5rem);
  --a:clamp(0, calc((var(--t) - var(--i) + .25) * 4), 1);          /* fade in  : t in [i-.25, i]   */
  --b:clamp(0, calc((var(--i) + 1.25 - var(--t)) * 4), 1);         /* fade out : t in [i+1, i+1.25] */
  --e:calc(1 - var(--a)); --l:calc(1 - var(--b));
  opacity:min(var(--a), var(--b));
  transform:translateX(calc((var(--e) - var(--l)) * 5vw));
  pointer-events:none;text-shadow:0 1px 24px rgba(0,0,0,.5);}
.cin-frame[data-on="true"]{pointer-events:auto;}
@media (min-width:900px){.cin-frame{grid-template-columns:minmax(0,26rem) minmax(0,1fr);gap:clamp(2rem,5vw,5rem);align-items:center;}}

.cin-frame-text{display:grid;gap:1.1rem;align-content:center;}
.cin-frame-no{margin:0;font:500 .68rem/1 var(--cin-sans);letter-spacing:.34em;text-transform:uppercase;color:var(--cin-accent);}
.cin-frame-no span{color:var(--cin-muted);}
.cin-frame-title{margin:0;font:300 clamp(2rem,4.4vw,3.8rem)/1.02 var(--cin-display);letter-spacing:-.005em;}
.cin-frame-sum{margin:0;max-width:30rem;font:300 clamp(.9rem,1.05vw,1rem)/1.75 var(--cin-sans);color:color-mix(in srgb,var(--cin-fg) 82%,transparent);
  display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden;}
.cin-tech{display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none;}
.cin-tech li{padding:.35rem .7rem;border:1px solid color-mix(in srgb,var(--cin-fg) 22%,transparent);border-radius:999px;
  font:400 .62rem/1 var(--cin-sans);letter-spacing:.2em;text-transform:uppercase;color:color-mix(in srgb,var(--cin-fg) 78%,transparent);}
.cin-watch{justify-self:start;display:inline-flex;align-items:baseline;gap:.8rem;padding:.5rem 0;border-bottom:1px solid var(--cin-accent);text-decoration:none;
  font:500 .7rem/1 var(--cin-sans);letter-spacing:.28em;text-transform:uppercase;color:var(--cin-accent);}
.cin-watch span{font-weight:300;letter-spacing:.12em;text-transform:none;color:var(--cin-muted);}
.cin-watch b{font-weight:400;transition:transform .3s;}
.cin-watch:hover b{transform:translate(3px,-3px);}

/* the "screen" */
.cin-screen{position:relative;justify-self:center;width:min(100%,52rem);aspect-ratio:16/10;overflow:hidden;border-radius:3px;
  border:1px solid color-mix(in srgb,var(--cin-accent) 35%,transparent);
  box-shadow:0 0 110px color-mix(in srgb,var(--cin-accent) 16%,transparent),0 40px 90px rgba(0,0,0,.55);background:#0c0907;}
.cin-screen::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:repeating-linear-gradient(0deg,rgba(0,0,0,.09) 0 1px,transparent 1px 3px),radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.5));}
.cin-screen img{display:block;width:100%;height:100%;object-fit:cover;filter:sepia(.18) saturate(.92) contrast(1.05);
  transform:scale(calc(1.04 + clamp(0, calc(var(--t) - var(--i)), 1) * .07));}   /* slow push-in while it holds */
.cin-poster{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:.8rem;padding:2rem;text-align:center;
  background:radial-gradient(ellipse at 30% 20%,color-mix(in srgb,var(--cin-accent) 28%,transparent),transparent 60%),linear-gradient(160deg,#1c130c,#0a0705);}
.cin-poster span{font:300 clamp(4rem,12vw,9rem)/.9 var(--cin-display);color:transparent;-webkit-text-stroke:1px color-mix(in srgb,var(--cin-accent) 70%,transparent);}
.cin-poster em{font:italic 300 clamp(1rem,2vw,1.5rem)/1.2 var(--cin-display);color:color-mix(in srgb,var(--cin-fg) 75%,transparent);}
@media (max-width:899px){.cin-screen{order:-1;aspect-ratio:16/9;max-height:28vh;}.cin-frame{padding-top:calc(var(--bar) + 6.2rem);}.cin-frame-sum{-webkit-line-clamp:4;}}

/* reel (frame index) */
.cin-reel{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(var(--bar) + 3.4rem);display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem;max-width:80vw;pointer-events:auto;}
.cin-reel button{width:1.7rem;height:1.1rem;padding:3px;background:none;border:1px solid color-mix(in srgb,var(--cin-fg) 30%,transparent);border-radius:2px;cursor:pointer;transition:border-color .3s;}
.cin-reel button i{display:block;width:100%;height:100%;background:color-mix(in srgb,var(--cin-fg) 18%,transparent);transition:background .3s;}
.cin-reel button[data-on="true"]{border-color:var(--cin-accent);}
.cin-reel button[data-on="true"] i{background:var(--cin-accent);}

/* ---------- skills (chapter II): the craft ---------- */
.cin-skills{position:absolute;inset:0;display:grid;align-content:center;gap:2.2rem;
  padding:calc(var(--bar) + 4.5rem) clamp(1.5rem,8vw,7rem);}
.cin-skills::before{content:"";position:absolute;inset:0;z-index:-1;
  background:linear-gradient(105deg,rgba(0,12,14,.68),rgba(0,12,14,.22) 55%,transparent);}
.cin-skills-head{display:grid;gap:.55rem;}
.cin-skills-title{margin:0;font:300 clamp(1.1rem,1.8vw,1.4rem)/1.2 var(--cin-sans);letter-spacing:.34em;text-transform:uppercase;color:var(--cin-muted);}
.cin-skills-body{display:grid;gap:1.8rem;max-width:38rem;}
.cin-skill-group{display:grid;gap:.75rem;}
.cin-skill-tier{margin:0;display:flex;align-items:baseline;gap:.7rem;
  font:500 .62rem/1 var(--cin-sans);letter-spacing:.36em;text-transform:uppercase;color:var(--cin-accent);}
.cin-skill-tier span{font-weight:300;letter-spacing:.18em;color:var(--cin-muted);}
.cin-skill-list{margin:0;padding:0;list-style:none;display:grid;gap:.55rem;}
.cin-skill{display:grid;gap:.35rem;}
.cin-skill-row{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;}
.cin-skill-name{font:300 clamp(.95rem,1.15vw,1.08rem)/1.35 var(--cin-sans);color:color-mix(in srgb,var(--cin-fg) 90%,transparent);}
.cin-skill-lvl{font:400 .62rem/1 var(--cin-sans);letter-spacing:.2em;text-transform:uppercase;color:var(--cin-muted);white-space:nowrap;}
.cin-skill-bar{height:1px;background:color-mix(in srgb,var(--cin-fg) 14%,transparent);overflow:hidden;}
.cin-skill-bar i{display:block;height:100%;background:var(--cin-accent);
  transform-origin:left;transform:scaleX(var(--r,1));opacity:.85;}
.cin-skills-foot{margin:.4rem 0 0;font:300 .72rem/1.5 var(--cin-sans);letter-spacing:.22em;text-transform:uppercase;color:var(--cin-muted);}
@media (min-width:900px){
  .cin-skills-body{max-width:42rem;}
  .cin-skill-list{grid-template-columns:1fr 1fr;gap:.55rem 2.4rem;}
}

/* ---------- experience (chapter IV): the road so far ---------- */
.cin-road{position:absolute;inset:0;
  --t:calc(clamp(0, (var(--act-p) - 0.1) / 0.8, 1) * var(--n));}
.cin-road::before{content:"";position:absolute;inset:0;z-index:-1;
  background:linear-gradient(100deg,rgba(0,10,12,.72),rgba(0,10,12,.25) 50%,transparent);}
.cin-road-head{position:absolute;top:calc(var(--bar) + 3.4rem);left:clamp(1.5rem,8vw,7rem);display:grid;gap:.55rem;z-index:2;}
.cin-road-title{margin:0;font:300 clamp(1.1rem,1.8vw,1.4rem)/1.2 var(--cin-sans);letter-spacing:.34em;text-transform:uppercase;color:var(--cin-muted);}

.cin-stations{position:absolute;inset:0;}
.cin-station{position:absolute;inset:0;display:grid;align-content:center;
  padding:calc(var(--bar) + 8rem) clamp(1.5rem,8vw,7rem) calc(var(--bar) + 6rem);
  --a:clamp(0, calc((var(--t) - var(--i) + .3) * 3.5), 1);
  --b:clamp(0, calc((var(--i) + 1.3 - var(--t)) * 3.5), 1);
  --e:calc(1 - var(--a)); --l:calc(1 - var(--b));
  opacity:min(var(--a), var(--b));
  transform:translateY(calc((var(--e) - var(--l)) * 3vh));
  pointer-events:none;text-shadow:0 1px 24px rgba(0,0,0,.5);}
.cin-station[data-on="true"]{pointer-events:auto;}
@media (min-width:900px){
  .cin-station{grid-template-columns:4.5rem minmax(0,34rem);gap:2rem;align-items:start;}
}

.cin-station-mark{display:none;}
@media (min-width:900px){
  .cin-station-mark{display:grid;place-items:center;width:3.2rem;height:3.2rem;margin-top:.15rem;
    border:1px solid color-mix(in srgb,var(--cin-accent) 45%,transparent);border-radius:50%;
    font:300 .85rem/1 var(--cin-display);color:var(--cin-accent);
    box-shadow:0 0 24px color-mix(in srgb,var(--cin-accent) 18%,transparent);}
}

.cin-station-body{display:grid;gap:.85rem;max-width:34rem;}
.cin-station-meta{margin:0;font:400 .68rem/1.5 var(--cin-sans);letter-spacing:.22em;text-transform:uppercase;color:var(--cin-accent);}
.cin-station-meta span{color:var(--cin-muted);}
.cin-station-role{margin:0;font:300 clamp(1.8rem,3.8vw,3.2rem)/1.05 var(--cin-display);letter-spacing:-.005em;}
.cin-station-co{margin:0;font:300 clamp(1rem,1.3vw,1.15rem)/1.4 var(--cin-sans);color:color-mix(in srgb,var(--cin-fg) 72%,transparent);}
.cin-station-sum{margin:0;font:300 clamp(.9rem,1.05vw,1rem)/1.75 var(--cin-sans);color:color-mix(in srgb,var(--cin-fg) 80%,transparent);
  display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;}
.cin-station-list{margin:0;padding:0 0 0 1.1rem;display:grid;gap:.4rem;
  font:300 clamp(.88rem,1vw,.98rem)/1.65 var(--cin-sans);color:color-mix(in srgb,var(--cin-fg) 78%,transparent);}
.cin-station-list li{padding-left:.2rem;}
.cin-station-list li::marker{color:var(--cin-accent);}

.cin-road-nav{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(var(--bar) + 3.4rem);
  display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem;max-width:80vw;pointer-events:auto;}
.cin-road-nav button{width:1.7rem;height:1.1rem;padding:3px;background:none;
  border:1px solid color-mix(in srgb,var(--cin-fg) 30%,transparent);border-radius:2px;cursor:pointer;transition:border-color .3s;}
.cin-road-nav button i{display:block;width:100%;height:100%;background:color-mix(in srgb,var(--cin-fg) 18%,transparent);transition:background .3s;}
.cin-road-nav button[data-on="true"]{border-color:var(--cin-accent);}
.cin-road-nav button[data-on="true"] i{background:var(--cin-accent);}



/* ---------- education (chapter V): where it began ---------- */
.cin-edu{position:absolute;inset:0;
  --t:calc(clamp(0, (var(--act-p) - 0.1) / 0.8, 1) * var(--n));}
.cin-edu::before{content:"";position:absolute;inset:0;z-index:-1;
  background:linear-gradient(95deg,rgba(12,4,10,.7),rgba(12,4,10,.22) 55%,transparent);}
.cin-edu-head{position:absolute;top:calc(var(--bar) + 3.4rem);left:clamp(1.5rem,8vw,7rem);display:grid;gap:.55rem;z-index:2;}
.cin-edu-title{margin:0;font:300 clamp(1.1rem,1.8vw,1.4rem)/1.2 var(--cin-sans);letter-spacing:.34em;text-transform:uppercase;color:var(--cin-muted);}

.cin-chapters{position:absolute;inset:0;}
.cin-chapter{position:absolute;inset:0;display:grid;align-content:center;
  padding:calc(var(--bar) + 8rem) clamp(1.5rem,8vw,7rem) calc(var(--bar) + 6rem);
  --a:clamp(0, calc((var(--t) - var(--i) + .3) * 3.5), 1);
  --b:clamp(0, calc((var(--i) + 1.3 - var(--t)) * 3.5), 1);
  --e:calc(1 - var(--a)); --l:calc(1 - var(--b));
  opacity:min(var(--a), var(--b));
  transform:translateY(calc((var(--e) - var(--l)) * 3vh));
  pointer-events:none;text-shadow:0 1px 24px rgba(0,0,0,.5);}
.cin-chapter[data-on="true"]{pointer-events:auto;}
@media (min-width:900px){
  .cin-chapter{grid-template-columns:4.5rem minmax(0,34rem);gap:2rem;align-items:start;}
}

.cin-chapter-mark{display:none;}
@media (min-width:900px){
  .cin-chapter-mark{display:grid;place-items:center;width:3.2rem;height:3.2rem;margin-top:.15rem;
    border:1px solid color-mix(in srgb,var(--cin-accent) 45%,transparent);border-radius:50%;
    font:300 .85rem/1 var(--cin-display);color:var(--cin-accent);
    box-shadow:0 0 24px color-mix(in srgb,var(--cin-accent) 18%,transparent);}
}

.cin-chapter-body{display:grid;gap:.85rem;max-width:34rem;}
.cin-chapter-meta{margin:0;font:400 .68rem/1.5 var(--cin-sans);letter-spacing:.22em;text-transform:uppercase;color:var(--cin-accent);}
.cin-chapter-meta span{color:var(--cin-muted);}
.cin-chapter-degree{margin:0;font:300 clamp(1.8rem,3.8vw,3.2rem)/1.05 var(--cin-display);letter-spacing:-.005em;}
.cin-chapter-school{margin:0;font:300 clamp(1rem,1.3vw,1.15rem)/1.4 var(--cin-sans);color:color-mix(in srgb,var(--cin-fg) 72%,transparent);}
.cin-chapter-sum{margin:0;font:300 clamp(.9rem,1.05vw,1rem)/1.75 var(--cin-sans);color:color-mix(in srgb,var(--cin-fg) 80%,transparent);
  display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;}

.cin-edu-nav{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(var(--bar) + 3.4rem);
  display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem;max-width:80vw;pointer-events:auto;}
.cin-edu-nav button{width:1.7rem;height:1.1rem;padding:3px;background:none;
  border:1px solid color-mix(in srgb,var(--cin-fg) 30%,transparent);border-radius:2px;cursor:pointer;transition:border-color .3s;}
.cin-edu-nav button i{display:block;width:100%;height:100%;background:color-mix(in srgb,var(--cin-fg) 18%,transparent);transition:background .3s;}
.cin-edu-nav button[data-on="true"]{border-color:var(--cin-accent);}
.cin-edu-nav button[data-on="true"] i{background:var(--cin-accent);}

/* ---------- certificates (chapter VI): keepsakes ---------- */
.cin-keeps{position:absolute;inset:0;display:grid;align-content:center;gap:2.4rem;
  padding:calc(var(--bar) + 4.5rem) clamp(1.5rem,8vw,7rem);}
.cin-keeps::before{content:"";position:absolute;inset:0;z-index:-1;
  background:linear-gradient(110deg,rgba(8,12,22,.68),rgba(8,12,22,.2) 55%,transparent);}
.cin-keeps-head{display:grid;gap:.55rem;}
.cin-keeps-title{margin:0;font:300 clamp(1.1rem,1.8vw,1.4rem)/1.2 var(--cin-sans);letter-spacing:.34em;text-transform:uppercase;color:var(--cin-muted);}

.cin-keeps-grid{margin:0;padding:0;list-style:none;display:grid;gap:1rem;
  grid-template-columns:1fr;max-width:52rem;}
@media (min-width:640px){.cin-keeps-grid{grid-template-columns:1fr 1fr;}}
@media (min-width:1100px){.cin-keeps-grid{grid-template-columns:1fr 1fr 1fr;}}

.cin-keep{margin:0;}
.cin-keep-card{display:grid;gap:.55rem;padding:1.35rem 1.4rem 1.25rem;
  border:1px solid color-mix(in srgb,var(--cin-fg) 16%,transparent);border-radius:3px;
  background:color-mix(in srgb,var(--cin-fg) 4%,transparent);
  transition:border-color .35s, background .35s;}
.cin-keep-card:hover{border-color:color-mix(in srgb,var(--cin-accent) 40%,transparent);
  background:color-mix(in srgb,var(--cin-accent) 6%,transparent);}

.cin-keep-name{margin:0;font:300 clamp(1.05rem,1.4vw,1.25rem)/1.25 var(--cin-display);letter-spacing:-.01em;}
.cin-keep-issuer{margin:0;font:300 .9rem/1.4 var(--cin-sans);color:color-mix(in srgb,var(--cin-fg) 72%,transparent);}
.cin-keep-date{margin:0;font:400 .62rem/1 var(--cin-sans);letter-spacing:.22em;text-transform:uppercase;color:var(--cin-accent);}
.cin-keep-link{justify-self:start;margin-top:.35rem;display:inline-flex;align-items:baseline;gap:.55rem;
  padding:.35rem 0;border-bottom:1px solid var(--cin-accent);text-decoration:none;
  font:500 .65rem/1 var(--cin-sans);letter-spacing:.24em;text-transform:uppercase;color:var(--cin-accent);}
.cin-keep-link b{font-weight:400;transition:transform .3s;}
.cin-keep-link:hover b{transform:translate(3px,-3px);}

/* ---------- contact (epilogue): until next time ---------- */
.cin-epilogue{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;
  padding:calc(var(--bar) + 3rem) clamp(1.5rem,6vw,5rem);text-align:center;}
.cin-epilogue::before{content:"";position:absolute;inset:0;z-index:-1;
  background:radial-gradient(ellipse at 50% 40%,rgba(18,6,14,.55),rgba(4,2,6,.75) 70%);}
.cin-epilogue-inner{display:grid;justify-items:center;gap:1.3rem;max-width:36rem;width:100%;}
.cin-epilogue-title{margin:0;font:300 clamp(2.4rem,7vw,4.8rem)/1.05 var(--cin-display);letter-spacing:-.01em;
  text-shadow:0 0 50px color-mix(in srgb,var(--cin-accent) 22%,transparent);}

.cin-links{margin:.4rem 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;justify-content:center;gap:.9rem 1.6rem;}
.cin-links a{text-decoration:none;padding:.35rem 0;border-bottom:1px solid color-mix(in srgb,var(--cin-fg) 22%,transparent);
  font:400 .72rem/1 var(--cin-sans);letter-spacing:.28em;text-transform:uppercase;color:color-mix(in srgb,var(--cin-fg) 82%,transparent);
  transition:color .3s,border-color .3s;}
.cin-links a:hover{color:var(--cin-accent);border-color:var(--cin-accent);}

.cin-form{margin-top:1.2rem;width:100%;display:grid;gap:1rem;text-align:left;}
.cin-form-row{display:grid;gap:1rem;}
@media (min-width:560px){.cin-form-row{grid-template-columns:1fr 1fr;}}
.cin-form label{display:grid;gap:.4rem;}
.cin-form label span{font:500 .62rem/1 var(--cin-sans);letter-spacing:.28em;text-transform:uppercase;color:var(--cin-muted);}
.cin-form input,.cin-form textarea{
  width:100%;box-sizing:border-box;padding:.75rem .9rem;border-radius:2px;
  border:1px solid color-mix(in srgb,var(--cin-fg) 18%,transparent);
  background:color-mix(in srgb,var(--cin-fg) 5%,transparent);color:var(--cin-fg);
  font:300 .95rem/1.45 var(--cin-sans);outline:none;transition:border-color .3s;}
.cin-form input:focus,.cin-form textarea:focus{border-color:color-mix(in srgb,var(--cin-accent) 55%,transparent);}
.cin-form textarea{resize:vertical;min-height:6.5rem;}
.cin-form-actions{display:flex;flex-wrap:wrap;align-items:center;gap:.9rem 1.2rem;margin-top:.2rem;}
.cin-form button{
  background:none;border:1px solid var(--cin-accent);border-radius:2px;padding:.7rem 1.4rem;cursor:pointer;
  font:500 .68rem/1 var(--cin-sans);letter-spacing:.28em;text-transform:uppercase;color:var(--cin-accent);
  transition:background .3s,color .3s;}
.cin-form button:hover:not(:disabled){background:var(--cin-accent);color:var(--cin-bg,#050308);}
.cin-form button:disabled{opacity:.55;cursor:default;}
.cin-form-ok{margin:0;font:300 .85rem/1.4 var(--cin-sans);color:var(--cin-accent);}
.cin-form-err{margin:0;font:300 .85rem/1.4 var(--cin-sans);color:#ff8a8a;}


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