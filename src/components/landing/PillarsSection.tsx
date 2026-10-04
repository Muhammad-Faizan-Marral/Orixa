"use client";

/**
 * Three product pillars under the hero.
 * CSS-only 3D objects (no Three.js) — stays fast on mobile / free Vercel.
 * Content mirrors real product: AI onboarding, premium themes, analytics + contact.
 */

const PILLARS = [
  {
    id: "ai",
    eyebrow: "AI onboarding",
    title: "Resume in. Portfolio out.",
    body: "Other builders make you type every field. OrixaAI reads your CV and fills experience, skills, and education for you.",
    accent: "from-[#6c5cff] to-[#22d3ee]",
  },
  {
    id: "design",
    eyebrow: "Designs you won’t find elsewhere",
    title: "Not the same 5 templates everyone uses.",
    body: "Theme system + Design Lab variants built for real personal sites — not Canva-style clones flooding the market.",
    accent: "from-[#22d3ee] to-[#34d399]",
  },
  {
    id: "reach",
    eyebrow: "Analytics + contact",
    title: "See who visited. Let them reach you.",
    body: "Views, countries, sources, project clicks — plus a working contact form that emails you. Most free portfolio tools skip this.",
    accent: "from-[#fbbf24] to-[#fb7185]",
  },
] as const;

/** Lightweight CSS 3D — AI / brain-node style */
function ObjectAI() {
  return (
    <div className="pillar-scene" aria-hidden="true">
      <div className="pillar-cube pillar-cube--ai">
        <span className="face face-f" />
        <span className="face face-b" />
        <span className="face face-l" />
        <span className="face face-r" />
        <span className="face face-t" />
        <span className="face face-bt" />
      </div>
      <div className="pillar-orbit">
        <span className="pillar-dot" />
        <span className="pillar-dot pillar-dot--2" />
        <span className="pillar-dot pillar-dot--3" />
      </div>
    </div>
  );
}

/** Stacked cards — design system */
function ObjectDesign() {
  return (
    <div className="pillar-scene" aria-hidden="true">
      <div className="pillar-stack">
        <div className="pillar-card pillar-card--1" />
        <div className="pillar-card pillar-card--2" />
        <div className="pillar-card pillar-card--3" />
      </div>
    </div>
  );
}

/** Chart bars + signal — analytics / contact */
function ObjectReach() {
  return (
    <div className="pillar-scene" aria-hidden="true">
      <div className="pillar-chart">
        <span style={{ height: "40%" }} />
        <span style={{ height: "70%" }} />
        <span style={{ height: "55%" }} />
        <span style={{ height: "90%" }} />
        <span style={{ height: "65%" }} />
      </div>
      <div className="pillar-pulse" />
    </div>
  );
}

const OBJECTS = {
  ai: ObjectAI,
  design: ObjectDesign,
  reach: ObjectReach,
} as const;

export default function PillarsSection() {
  return (
    <section id="pillars" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
                <div className="mx-auto max-w-2xl text-center">
          <p className="text-caption mb-3">What you get</p>
          <h2 className="text-h1 text-balance">
            Built for people who are{" "}
            <span className="text-gradient-ion">tired of generic portfolios.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PILLARS.map((p) => {
            const Obj = OBJECTS[p.id];
            return (
              <article
                key={p.id}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface/40 p-6 backdrop-blur transition-colors hover:border-border-strong hover:bg-surface/70"
              >
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${p.accent} opacity-[0.12] blur-2xl transition-opacity group-hover:opacity-25`}
                />
                <div className="relative mb-6 flex h-28 items-center justify-center">
                  <Obj />
                </div>
                <p className="text-caption mb-2 text-accent">{p.eyebrow}</p>
                <h3 className="text-h3 text-balance">{p.title}</h3>
                <p className="text-body mt-3 text-muted-foreground">{p.body}</p>
              </article>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .pillar-scene {
          position: relative;
          width: 7rem;
          height: 7rem;
          perspective: 600px;
          margin: 0 auto;
        }

        /* AI cube */
        .pillar-cube {
          position: absolute;
          inset: 20% 20%;
          transform-style: preserve-3d;
          animation: pillar-spin 8s linear infinite;
        }
        .pillar-cube .face {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(108, 92, 255, 0.45);
          background: linear-gradient(
            135deg,
            rgba(108, 92, 255, 0.25),
            rgba(34, 211, 238, 0.15)
          );
          border-radius: 6px;
        }
        .face-f {
          transform: translateZ(1.4rem);
        }
        .face-b {
          transform: rotateY(180deg) translateZ(1.4rem);
        }
        .face-l {
          transform: rotateY(-90deg) translateZ(1.4rem);
        }
        .face-r {
          transform: rotateY(90deg) translateZ(1.4rem);
        }
        .face-t {
          transform: rotateX(90deg) translateZ(1.4rem);
        }
        .face-bt {
          transform: rotateX(-90deg) translateZ(1.4rem);
        }

        .pillar-orbit {
          position: absolute;
          inset: 8%;
          border: 1px dashed rgba(34, 211, 238, 0.35);
          border-radius: 50%;
          animation: pillar-spin 12s linear infinite reverse;
        }
        .pillar-dot {
          position: absolute;
          top: 0;
          left: 50%;
          width: 6px;
          height: 6px;
          margin-left: -3px;
          margin-top: -3px;
          border-radius: 50%;
          background: #22d3ee;
          box-shadow: 0 0 10px #22d3ee;
        }
        .pillar-dot--2 {
          top: 50%;
          left: 100%;
          background: #6c5cff;
          box-shadow: 0 0 10px #6c5cff;
        }
        .pillar-dot--3 {
          top: 100%;
          left: 40%;
          background: #34d399;
          box-shadow: 0 0 10px #34d399;
        }

        /* Design stack */
        .pillar-stack {
          position: absolute;
          inset: 10%;
          transform-style: preserve-3d;
          transform: rotateX(12deg) rotateY(-18deg);
        }
        .pillar-card {
          position: absolute;
          inset: 10% 5%;
          border-radius: 10px;
          border: 1px solid rgba(34, 211, 238, 0.35);
          background: linear-gradient(
            160deg,
            rgba(34, 211, 238, 0.2),
            rgba(15, 17, 22, 0.9)
          );
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
        }
        .pillar-card--1 {
          transform: translateZ(0) translateY(12px);
          opacity: 0.55;
        }
        .pillar-card--2 {
          transform: translateZ(12px) translateY(4px);
          opacity: 0.8;
        }
        .pillar-card--3 {
          transform: translateZ(24px) translateY(-6px);
          animation: pillar-float 3s ease-in-out infinite;
        }

        /* Analytics bars */
        .pillar-chart {
          position: absolute;
          inset: 18% 12% 22%;
          display: flex;
          align-items: flex-end;
          gap: 6px;
        }
        .pillar-chart span {
          flex: 1;
          border-radius: 4px 4px 0 0;
          background: linear-gradient(180deg, #fbbf24, #fb7185);
          opacity: 0.85;
          animation: pillar-bar 1.6s ease-in-out infinite;
        }
        .pillar-chart span:nth-child(2) {
          animation-delay: 0.1s;
        }
        .pillar-chart span:nth-child(3) {
          animation-delay: 0.2s;
        }
        .pillar-chart span:nth-child(4) {
          animation-delay: 0.3s;
        }
        .pillar-chart span:nth-child(5) {
          animation-delay: 0.4s;
        }
        .pillar-pulse {
          position: absolute;
          right: 8%;
          top: 12%;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.5);
          animation: pillar-ping 1.8s ease-out infinite;
        }

        @keyframes pillar-spin {
          to {
            transform: rotateX(12deg) rotateY(360deg);
          }
        }
        @keyframes pillar-float {
          0%,
          100% {
            transform: translateZ(24px) translateY(-6px);
          }
          50% {
            transform: translateZ(24px) translateY(-12px);
          }
        }
        @keyframes pillar-bar {
          0%,
          100% {
            transform: scaleY(0.85);
            opacity: 0.7;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        @keyframes pillar-ping {
          0% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.45);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(52, 211, 153, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pillar-cube,
          .pillar-orbit,
          .pillar-card--3,
          .pillar-chart span,
          .pillar-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
