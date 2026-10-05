"use client";

/**
 * OrixaAI — compact product pillars (understood in one glance).
 *   Row 1: Resume → Templates → Portfolio
 *   Row 2: Analytics  |  Contact form (auto-plays: fill → send → green success)
 *
 * CSS-only visuals, transform/opacity animations, timers run only while
 * visible, reduced-motion shows the final static state.
 */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* ───────────────────────── data ───────────────────────── */

type Template = {
  id: string;
  name: string;
  bg: string;
  fg: string;
  ac: string;
  bd: string;
  ff: string;
};

const SANS = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const SERIF = "Georgia, 'Times New Roman', serif";

const TEMPLATES: Template[] = [
  {
    id: "minimal",
    name: "Minimal Airy",
    bg: "#fafafa",
    fg: "#18181b",
    ac: "#18181b",
    bd: "#e4e4e7",
    ff: SANS,
  },
  {
    id: "tech",
    name: "Tech Dense",
    bg: "#0b1220",
    fg: "#d6e4ff",
    ac: "#22d3ee",
    bd: "#1e3a5f",
    ff: MONO,
  },
  {
    id: "editorial",
    name: "Editorial",
    bg: "#f5efe6",
    fg: "#1c1917",
    ac: "#b45309",
    bd: "#d6cbb8",
    ff: SERIF,
  },
  {
    id: "luxury",
    name: "Soft Luxury",
    bg: "#1a1614",
    fg: "#f3e9dc",
    ac: "#d4af7a",
    bd: "#3a302a",
    ff: SERIF,
  },
  {
    id: "glass",
    name: "Neo Glass",
    bg: "#12092b",
    fg: "#f4f0ff",
    ac: "#a78bfa",
    bd: "rgba(255,255,255,.18)",
    ff: SANS,
  },
  {
    id: "brutalist",
    name: "Brutalist",
    bg: "#facc15",
    fg: "#000",
    ac: "#000",
    bd: "#000",
    ff: SANS,
  },
  {
    id: "cinematic",
    name: "Cinematic",
    bg: "#050506",
    fg: "#f4f4f5",
    ac: "#fb7185",
    bd: "#27272a",
    ff: SANS,
  },
];

const NAME = "Ayesha Khan";
const ROLE = "Product Designer";

const STATS = [
  { label: "Visitors", value: 2847 },
  { label: "Unique visitors", value: 1926 },
  { label: "Last 7 days", value: 642 },
  { label: "Last 30 days", value: 2847 },
  { label: "Countries", value: 38 },
  { label: "Projects viewed", value: 1204 },
  { label: "Contact clicks", value: 96 },
  { label: "Messages", value: 31 },
];

const HIGHLIGHTS = [
  { label: "Most viewed project", value: "Fintech Dashboard" },
  { label: "Most active country", value: "Pakistan" },
  { label: "Top traffic source", value: "LinkedIn" },
];

const DEMO = {
  name: "Sara Ahmed",
  email: "sara@studio.com",
  subject: "Project inquiry",
  message: "Hi Ayesha, loved your work. Are you free for a project next month?",
} as const;
type Field = keyof typeof DEMO;
const ORDER: Field[] = ["name", "email", "subject", "message"];

/* ───────────────────────── hooks ───────────────────────── */

function useInView<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      setLive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        setLive(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen, live };
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(mq.matches);
    const on = () => setR(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return r;
}

function CountUp({
  to,
  run,
  reduced,
}: {
  to: number;
  run: boolean;
  reduced: boolean;
}) {
  const [n, setN] = useState(reduced ? to : 0);
  useEffect(() => {
    if (!run) return;
    if (reduced) return setN(to);
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / 1000, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, reduced]);
  return <>{n.toLocaleString("en-US")}</>;
}

/* ───────────────────────── shared ───────────────────────── */

function Panel({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: ReactNode;
}) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 className="panel-title">{title}</h3>
        <p className="panel-sub">{sub}</p>
      </div>
      {children}
    </div>
  );
}

function Thumb({ t, size = "md" }: { t: Template; size?: "md" | "xs" }) {
  const vars = {
    "--bg": t.bg,
    "--fg": t.fg,
    "--ac": t.ac,
    "--bd": t.bd,
    "--ff": t.ff,
  } as CSSProperties;
  return (
    <div
      className={`tp tp--${t.id} tp--${size}`}
      style={vars}
      aria-hidden="true"
    >
      <div className="tp-nav">
        <i />
        <span>
          <b />
          <b />
          <b />
        </span>
      </div>
      <div className="tp-body">
        <p className="tp-role">{ROLE}</p>
        <p className="tp-title">{NAME}</p>
        <div className="tp-blocks">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Row 1: Resume → Portfolio ───────────────────────── */

const SHOWN = TEMPLATES.slice(0, 3);
const MORE = TEMPLATES.slice(3);
const MORE_INDEX = SHOWN.length;

function Step({
  n,
  label,
  children,
}: {
  n: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flow-col">
      <p className="flow-step">
        <b>{n}</b>
        {label}
      </p>
      {children}
    </div>
  );
}

function ResumeFlow() {
  const reduced = useReducedMotion();
  const { ref, live } = useInView<HTMLDivElement>();
  const [active, setActive] = useState(0);
  const hover = useRef(false);

  useEffect(() => {
    if (!live || reduced) return;
    const id = setInterval(() => {
      if (!hover.current) setActive((a) => (a + 1) % (SHOWN.length + 1));
    }, 2600);
    return () => clearInterval(id);
  }, [live, reduced]);

  const showMore = active === MORE_INDEX;

  return (
    <div ref={ref} className={`flow ${live && !reduced ? "flow--on" : ""}`}>
      <Step n={1} label="Upload your resume">
        <div className="resume" aria-hidden="true">
          <div className="resume-head">
            <span className="resume-avatar" />
            <div>
              <p className="resume-name">{NAME}</p>
              <p className="resume-role">{ROLE}</p>
            </div>
          </div>
          <div className="resume-lines">
            <i />
            <i />
            <i />
          </div>
          <div className="resume-chips">
            <i>Figma</i>
            <i>React</i>
            <i>UX</i>
          </div>
          <span className="resume-file">resume.pdf</span>
          <span className="resume-scan" />
        </div>
      </Step>

      <div className="flow-beam" aria-hidden="true">
        <span />
      </div>

      <Step n={2} label="Pick a design">
        <ul
          className="rail"
          aria-label="Premium templates"
          onPointerEnter={() => (hover.current = true)}
          onPointerLeave={() => (hover.current = false)}
        >
          {SHOWN.map((tp, i) => (
            <li key={tp.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`rail-pill ${i === active ? "is-active" : ""}`}
              >
                {tp.name}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => setActive(MORE_INDEX)}
              aria-pressed={showMore}
              aria-label="More designs"
              className={`rail-pill rail-pill--more ${showMore ? "is-active" : ""}`}
            >
              <span />
              <span />
              <span />
            </button>
          </li>
        </ul>
        <p className="flow-hint">premium designs</p>
      </Step>

      <div className="flow-beam" aria-hidden="true">
        <span />
      </div>

      <Step n={3} label="Get your portfolio">
        <div className="browser">
          <div className="browser-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>ayeshakhan.orixaai.com</span>
          </div>
          {showMore ? (
            <div key="more" className="browser-view multi">
              {MORE.map((tp) => (
                <div key={tp.id} className="multi-item">
                  <Thumb t={tp} size="xs" />
                  <span className="multi-name">{tp.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div key={SHOWN[active].id} className="browser-view">
              <Thumb t={SHOWN[active]} />
            </div>
          )}
        </div>
      </Step>
    </div>
  );
}

/* ───────────────────────── Row 2a: Analytics ───────────────────────── */

function Analytics() {
  const reduced = useReducedMotion();
  const { ref, seen } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="an">
      <div className="an-grid">
        {STATS.map((s) => (
          <div key={s.label} className="an-card">
            <p className="an-label">{s.label}</p>
            <p className="an-value">
              <CountUp to={s.value} run={seen} reduced={reduced} />
            </p>
          </div>
        ))}
      </div>
      <div className="an-hl">
        {HIGHLIGHTS.map((h) => (
          <div key={h.label} className="an-hl-item">
            <p className="an-label">{h.label}</p>
            <p className="an-hl-value">{h.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Row 2b: Contact form (auto-plays) ───────────────────────── */

type Phase = "typing" | "sending" | "sent";

function ContactDemo() {
  const reduced = useReducedMotion();
  const { ref, live } = useInView<HTMLDivElement>();
  const [vals, setVals] = useState<Record<Field, string>>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [focus, setFocus] = useState<Field | null>(null);
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    if (reduced) {
      setVals({ ...DEMO });
      setPhase("sent");
      return;
    }
    if (!live) return;
    let dead = false;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    (async () => {
      while (!dead) {
        setPhase("typing");
        setVals({ name: "", email: "", subject: "", message: "" });
        await sleep(500);
        for (const k of ORDER) {
          setFocus(k);
          const text = DEMO[k];
          for (let i = 1; i <= text.length; i++) {
            if (dead) return;
            setVals((v) => ({ ...v, [k]: text.slice(0, i) }));
            await sleep(k === "message" ? 20 : 38);
          }
          await sleep(160);
        }
        setFocus(null);
        await sleep(350);
        if (dead) return;
        setPhase("sending");
        await sleep(1000);
        if (dead) return;
        setPhase("sent");
        await sleep(3600);
      }
    })();
    return () => {
      dead = true;
    };
  }, [live, reduced]);

  const field = (k: Field, label: string, cls = "") => (
    <div className={`cf-field ${cls} ${focus === k ? "is-focus" : ""}`}>
      <span className="cf-label">{label}</span>
      <div className="cf-box">
        {vals[k]}
        {focus === k && <i className="cf-caret" />}
      </div>
    </div>
  );

  return (
    <div ref={ref} className="cf" aria-label="Contact form demo">
      <div className="cf-row">
        {field("name", "Name")}
        {field("email", "Email")}
      </div>
      {field("subject", "Subject")}
      {field("message", "Message", "cf-field--msg")}

      <div className={`cf-btn ${phase === "sending" ? "is-sending" : ""}`}>
        {phase === "sending" ? (
          <>
            <span className="cf-spin" /> Sending
          </>
        ) : (
          "Send message"
        )}
      </div>

      <div
        className={`cf-ok ${phase === "sent" ? "is-on" : ""}`}
        role="status"
        aria-live="polite"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" className="cf-ring" />
          <path d="M7.5 12.5l3 3 6-6.5" className="cf-tick" />
        </svg>
        <div>
          <p className="cf-ok-title">Message sent successfully</p>
          <p className="cf-ok-sub">
            Email delivered to the portfolio owner’s inbox.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── section ───────────────────────── */

export default function PillarsSection() {
  return (
    <section id="pillars" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-caption mb-3">What you get</p>
          <h2 className="text-h1 text-balance">
            Built for people who are{" "}
            <span className="text-gradient-ion">
              tired of generic portfolios.
            </span>
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:gap-5">
          <Panel
            title="Resume in. Portfolio out."
            sub="Upload your CV. AI fills in your experience, skills and education, then you choose a design. No typing every field."
          >
            <ResumeFlow />
          </Panel>

          <div className="grid gap-4 md:gap-5 lg:grid-cols-2">
            <Panel
              title="See who visited your portfolio."
              sub="Know your views, countries, top projects and where your traffic comes from."
            >
              <Analytics />
            </Panel>
            <Panel
              title="Let visitors reach you."
              sub="A visitor sends a message from your site and it lands straight in your email inbox."
            >
              <ContactDemo />
            </Panel>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .panel {
          border: 1px solid rgb(120 120 140 / 0.25);
          border-radius: 1.1rem;
          background: rgb(120 120 140 / 0.06);
          padding: 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        @media (min-width: 768px) {
          .panel {
            padding: 1.25rem 1.5rem;
          }
        }
        .panel-title {
          font-weight: 650;
          font-size: 1.05rem;
          line-height: 1.2;
        }
        .panel-sub {
          font-size: 0.82rem;
          opacity: 0.65;
          margin-top: 0.15rem;
        }

        /* ── Flow ── */
        .flow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
        }
        @media (min-width: 900px) {
          .flow {
            display: grid;
            grid-template-columns: 10.5rem 2.5rem 1fr 2.5rem 15rem;
            gap: 0;
          }
        }

        .resume {
          position: relative;
          width: 100%;
          max-width: 10.5rem;
          overflow: hidden;
          background: #fff;
          color: #18181b;
          border-radius: 0.65rem;
          padding: 0.8rem;
          box-shadow: 0 14px 30px rgb(0 0 0 / 0.25);
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .resume-head {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .resume-avatar {
          width: 1.7rem;
          height: 1.7rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #6c5cff, #22d3ee);
          flex: none;
        }
        .resume-name {
          font-weight: 700;
          font-size: 0.72rem;
          line-height: 1.1;
        }
        .resume-role {
          font-size: 0.62rem;
          color: #71717a;
        }
        .resume-lines {
          display: grid;
          gap: 0.28rem;
        }
        .resume-lines i {
          height: 4px;
          border-radius: 3px;
          background: #e4e4e7;
        }
        .resume-lines i:nth-child(2) {
          width: 80%;
        }
        .resume-lines i:nth-child(3) {
          width: 55%;
        }
        .resume-chips {
          display: flex;
          gap: 0.25rem;
        }
        .resume-chips i {
          font-style: normal;
          font-size: 0.56rem;
          padding: 0.08rem 0.4rem;
          border-radius: 999px;
          background: #ede9fe;
          color: #5b21b6;
        }
        .resume-file {
          font-size: 0.58rem;
          color: #a1a1aa;
        }
        .resume-scan {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 40%;
          background: linear-gradient(
            180deg,
            transparent,
            rgb(108 92 255 / 0.28)
          );
          border-bottom: 2px solid #6c5cff;
          opacity: 0;
          will-change: transform;
        }
        .flow--on .resume-scan {
          animation: scan 3s ease-in-out infinite;
        }
        @keyframes scan {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          15%,
          85% {
            opacity: 1;
          }
          100% {
            transform: translateY(260%);
            opacity: 0;
          }
        }

        .flow-beam {
          position: relative;
          height: 1.6rem;
          width: 2px;
          background: rgb(120 120 140 / 0.3);
          overflow: hidden;
          border-radius: 2px;
        }
        .flow-beam span {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent,
            #22d3ee,
            transparent
          );
          transform: translateY(-100%);
          will-change: transform;
        }
        .flow--on .flow-beam span {
          animation: beam-y 1.5s linear infinite;
        }
        @keyframes beam-y {
          to {
            transform: translateY(100%);
          }
        }
        @media (min-width: 900px) {
          .flow-beam {
            height: 2px;
            width: 100%;
          }
          .flow-beam span {
            background: linear-gradient(
              90deg,
              transparent,
              #22d3ee,
              transparent
            );
            transform: translateX(-100%);
          }
          .flow--on .flow-beam span {
            animation-name: beam-x;
          }
        }
        @keyframes beam-x {
          to {
            transform: translateX(100%);
          }
        }

        .flow-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          width: 100%;
          min-width: 0;
        }
        .flow-step {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .flow-step b {
          display: grid;
          place-items: center;
          width: 1.2rem;
          height: 1.2rem;
          border-radius: 50%;
          font-size: 0.66rem;
          color: #22d3ee;
          background: rgb(34 211 238 / 0.16);
        }
        .flow-hint {
          font-size: 0.7rem;
          opacity: 0.6;
        }
        .rail-pill--more {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 0.55rem 0.8rem;
        }
        .rail-pill--more span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
        }
        .multi {
          aspect-ratio: 16 / 10;
          display: grid;
          grid-template: 1fr 1fr / 1fr 1fr;
          gap: 5px;
          padding: 5px;
          background: #0f1116;
        }
        .multi-item {
          position: relative;
          min-height: 0;
        }
        .multi-item .tp {
          height: 100%;
          aspect-ratio: auto;
          border-radius: 4px;
        }
        .multi-name {
          position: absolute;
          left: 3px;
          bottom: 3px;
          z-index: 3;
          font-size: 0.52rem;
          line-height: 1;
          padding: 2px 4px;
          border-radius: 3px;
          color: #fff;
          background: rgb(0 0 0 / 0.65);
        }
        .rail {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.4rem;
          padding: 0 0.25rem;
        }
        .rail-pill {
          font-size: 0.78rem;
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          white-space: nowrap;
          border: 1px solid rgb(120 120 140 / 0.3);
          background: rgb(120 120 140 / 0.08);
          cursor: pointer;
          transition:
            transform 0.25s,
            background 0.25s,
            border-color 0.25s,
            box-shadow 0.25s;
        }
        .rail-pill:hover {
          border-color: rgb(120 120 140 / 0.6);
        }
        .rail-pill:focus-visible {
          outline: 2px solid #22d3ee;
          outline-offset: 2px;
        }
        .rail-pill.is-active {
          transform: scale(1.06);
          border-color: #22d3ee;
          background: rgb(34 211 238 / 0.14);
          box-shadow: 0 0 18px rgb(34 211 238 / 0.25);
        }

        .browser {
          width: 100%;
          max-width: 15rem;
          border-radius: 0.65rem;
          overflow: hidden;
          border: 1px solid rgb(120 120 140 / 0.35);
          background: #0f1116;
          box-shadow: 0 16px 34px rgb(0 0 0 / 0.3);
        }
        .browser-bar {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.35rem 0.55rem;
          background: #171a21;
        }
        .browser-bar i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3f4450;
        }
        .browser-bar span {
          margin-left: 0.4rem;
          font-size: 0.58rem;
          color: #9aa3b2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .browser-view {
          animation: view-in 0.45s ease both;
        }
        @keyframes view-in {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        /* ── Template preview (em-based) ── */
        .tp {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 16 / 10;
          font-size: 10px;
          background: var(--bg);
          color: var(--fg);
          font-family: var(--ff);
          display: flex;
          flex-direction: column;
        }
        .tp--xs {
          font-size: 4.5px;
        }
        .tp-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.9em 1.1em 0;
          position: relative;
          z-index: 1;
        }
        .tp-nav i {
          width: 1.3em;
          height: 1.3em;
          border-radius: 50%;
          background: var(--ac);
        }
        .tp-nav span {
          display: flex;
          gap: 0.4em;
        }
        .tp-nav b {
          width: 1.5em;
          height: 0.3em;
          border-radius: 1em;
          background: var(--fg);
          opacity: 0.35;
        }
        .tp-body {
          flex: 1;
          padding: 1.1em;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.4em;
          position: relative;
          z-index: 1;
        }
        .tp-role {
          font-size: 0.85em;
          opacity: 0.7;
        }
        .tp-title {
          font-size: 1.9em;
          font-weight: 700;
          line-height: 1.05;
        }
        .tp-blocks {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5em;
          margin-top: 0.6em;
        }
        .tp-blocks i {
          height: 2em;
          border-radius: 0.4em;
          background: var(--fg);
          opacity: 0.1;
          border: 1px solid var(--bd);
        }

        .tp--minimal .tp-title {
          font-weight: 300;
          letter-spacing: -0.02em;
        }
        .tp--minimal .tp-body {
          padding: 1.5em;
          gap: 0.7em;
        }
        .tp--minimal .tp-blocks i {
          background: transparent;
          opacity: 1;
          height: 0.2em;
          border: 0;
          border-top: 1px solid var(--bd);
          border-radius: 0;
        }
        .tp--tech .tp-title {
          font-size: 1.4em;
        }
        .tp--tech .tp-role::before {
          content: "$ ";
          color: var(--ac);
        }
        .tp--tech .tp-blocks i {
          background: var(--ac);
          opacity: 0.2;
          border-radius: 0.2em;
        }
        .tp--editorial .tp-title {
          font-size: 2.2em;
          font-style: italic;
          font-weight: 400;
        }
        .tp--editorial .tp-role {
          color: var(--ac);
          opacity: 1;
        }
        .tp--luxury .tp-body {
          align-items: center;
          text-align: center;
        }
        .tp--luxury .tp-title {
          font-weight: 400;
          letter-spacing: 0.08em;
          font-size: 1.6em;
          color: var(--ac);
        }
        .tp--luxury .tp-blocks i {
          border-color: var(--ac);
          background: transparent;
          opacity: 0.45;
        }
        .tp--glass::before,
        .tp--glass::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          filter: blur(2em);
        }
        .tp--glass::before {
          width: 8em;
          height: 8em;
          background: #7c3aed;
          top: -2em;
          left: -2em;
          opacity: 0.8;
        }
        .tp--glass::after {
          width: 7em;
          height: 7em;
          background: #22d3ee;
          bottom: -2em;
          right: -1em;
          opacity: 0.6;
        }
        .tp--glass .tp-body {
          margin: 0.6em 1.1em 1.1em;
          border-radius: 0.9em;
          background: rgb(255 255 255 / 0.1);
          border: 1px solid rgb(255 255 255 / 0.22);
        }
        .tp--glass .tp-blocks i {
          background: #fff;
          opacity: 0.18;
        }
        .tp--brutalist {
          box-shadow: inset 0 0 0 0.2em #000;
        }
        .tp--brutalist .tp-title {
          text-transform: uppercase;
          font-weight: 900;
          font-size: 1.7em;
        }
        .tp--brutalist .tp-nav i {
          border-radius: 0;
        }
        .tp--brutalist .tp-blocks i {
          background: #fff;
          opacity: 1;
          border: 0.16em solid #000;
          border-radius: 0;
          box-shadow: 0.22em 0.22em 0 #000;
        }
        .tp--cinematic {
          background:
            radial-gradient(
              ellipse at 70% 40%,
              rgb(251 113 133 / 0.35),
              transparent 60%
            ),
            var(--bg);
        }
        .tp--cinematic::before,
        .tp--cinematic::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 12%;
          background: #000;
          z-index: 2;
        }
        .tp--cinematic::before {
          top: 0;
        }
        .tp--cinematic::after {
          bottom: 0;
        }
        .tp--cinematic .tp-title {
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 1.4em;
        }
        .tp--cinematic .tp-blocks {
          display: none;
        }

        /* ── Analytics ── */
        .an {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          flex: 1;
        }
        .an-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }
        @media (min-width: 560px) {
          .an-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .an-card {
          border-radius: 0.7rem;
          border: 1px solid rgb(120 120 140 / 0.25);
          background: rgb(120 120 140 / 0.07);
          padding: 0.55rem 0.7rem;
        }
        .an-label {
          font-size: 0.68rem;
          opacity: 0.65;
        }
        .an-value {
          font-size: 1.15rem;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }
        .an-hl {
          display: grid;
          gap: 0.5rem;
          margin-top: auto;
        }
        @media (min-width: 560px) {
          .an-hl {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .an-hl-item {
          border-radius: 0.7rem;
          padding: 0.55rem 0.7rem;
          border: 1px solid rgb(251 191 36 / 0.3);
          background: rgb(251 191 36 / 0.07);
        }
        .an-hl-value {
          font-weight: 600;
          font-size: 0.85rem;
        }

        /* ── Contact demo ── */
        .cf {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          flex: 1;
        }
        .cf-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.55rem;
        }
        .cf-field {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
        }
        .cf-label {
          font-size: 0.68rem;
          opacity: 0.65;
        }
        .cf-box {
          min-height: 2.05rem;
          padding: 0.4rem 0.65rem;
          font-size: 0.82rem;
          border-radius: 0.55rem;
          border: 1px solid rgb(120 120 140 / 0.35);
          background: rgb(120 120 140 / 0.08);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
        }
        .cf-field--msg .cf-box {
          min-height: 3.7rem;
          white-space: normal;
          overflow-wrap: anywhere;
        }
        .cf-field.is-focus .cf-box {
          border-color: #fbbf24;
          box-shadow: 0 0 0 3px rgb(251 191 36 / 0.18);
        }
        .cf-caret {
          display: inline-block;
          width: 1px;
          height: 0.95em;
          margin-left: 1px;
          vertical-align: text-bottom;
          background: currentColor;
          animation: blink 1s steps(1) infinite;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }

        .cf-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.55rem 1rem;
          border-radius: 0.65rem;
          font-weight: 600;
          font-size: 0.85rem;
          color: #111;
          background: linear-gradient(90deg, #fbbf24, #fb7185);
          transition:
            transform 0.2s,
            opacity 0.2s;
        }
        .cf-btn.is-sending {
          opacity: 0.8;
          transform: scale(0.985);
        }
        .cf-spin {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 2px solid rgb(0 0 0 / 0.25);
          border-top-color: #111;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .cf-ok {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.6rem 0.8rem;
          border-radius: 0.7rem;
          color: #34d399;
          background: rgb(52 211 153 / 0.12);
          border: 1px solid rgb(52 211 153 / 0.4);
          opacity: 0;
          transform: translateY(8px);
          transition:
            opacity 0.35s,
            transform 0.35s;
        }
        .cf-ok.is-on {
          opacity: 1;
          transform: none;
        }
        .cf-ok svg {
          width: 1.7rem;
          height: 1.7rem;
          flex: none;
        }
        .cf-ring,
        .cf-tick {
          stroke-dasharray: 63;
          stroke-dashoffset: 63;
        }
        .cf-tick {
          stroke-dasharray: 20;
          stroke-dashoffset: 20;
        }
        .cf-ok.is-on .cf-ring {
          animation: draw 0.6s ease forwards;
        }
        .cf-ok.is-on .cf-tick {
          animation: draw 0.4s 0.45s ease forwards;
        }
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        .cf-ok-title {
          font-weight: 650;
          font-size: 0.85rem;
        }
        .cf-ok-sub {
          font-size: 0.72rem;
          opacity: 0.8;
        }

        @media (prefers-reduced-motion: reduce) {
          .flow--on .resume-scan,
          .flow--on .flow-beam span,
          .cf-caret,
          .cf-spin {
            animation: none !important;
          }
          .browser-view {
            animation: none !important;
          }
          .cf-ok,
          .rail-pill {
            transition: none !important;
          }
          .cf-ok.is-on .cf-ring,
          .cf-ok.is-on .cf-tick {
            animation: none !important;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
}
