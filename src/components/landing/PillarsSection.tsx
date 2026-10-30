"use client";

/**
 * OrixaAI — Product Pillars
 * Clean, premium, and focused presentation of the core product value.
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

/* ── trend chart ── */

const TREND = [38, 52, 45, 70, 64, 88, 76, 104, 97, 128, 118, 150, 141, 172];
const CH_W = 300;
const CH_H = 100;

function buildChart(data: number[]) {
  const pad = 10;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * CH_W,
    y: CH_H - pad - ((v - min) / (max - min)) * (CH_H - pad * 2),
  }));
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return {
    line: d,
    area: `${d} L${CH_W},${CH_H} L0,${CH_H} Z`,
    last: pts[pts.length - 1],
  };
}

const CHART = buildChart(TREND);

/* ── custom domain ── */

const DOMAIN = "ayeshakhan.com";
const SUBDOMAIN = "ayeshakhan.orixaai.com";
const CHECKS = ["Add CNAME record", "Verify DNS", "Issue SSL certificate"];

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

      <div
        className={`an-chart ${seen ? "an-chart--on" : ""}`}
        role="img"
        aria-label="Visitors trend over the last 30 days, rising 18 percent"
      >
        <div className="an-chart-head">
          <p className="an-label">Visitors · last 30 days</p>
          <span className="an-badge">▲ 18.4%</span>
        </div>
        <div className="an-chart-body">
          <div className="an-plot">
            <svg
              viewBox={`0 0 ${CH_W} ${CH_H}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="an-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[25, 50, 75].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2={CH_W}
                  y1={y}
                  y2={y}
                  className="an-grid-line"
                />
              ))}
              <path d={CHART.area} fill="url(#an-grad)" />
              <path
                d={CHART.line}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <span
            className="an-dot"
            style={{ top: `${(CHART.last.y / CH_H) * 100}%` }}
          />
        </div>
        <div className="an-axis" aria-hidden="true">
          <span>30d ago</span>
          <span>20d</span>
          <span>10d</span>
          <span>Today</span>
        </div>
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

/* ───────────────────────── Row 2b: Contact form ───────────────────────── */

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

/* ───────────────────────── Row 3: Custom domain ───────────────────────── */

function DomainDemo() {
  const reduced = useReducedMotion();
  const { ref, live } = useInView<HTMLDivElement>();
  const [domain, setDomain] = useState(reduced ? DOMAIN : "");
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState(reduced ? 4 : 0);

  useEffect(() => {
    if (reduced) {
      setDomain(DOMAIN);
      setStep(4);
      return;
    }
    if (!live) return;

    let dead = false;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    (async () => {
      while (!dead) {
        setStep(0);
        setDomain("");
        await sleep(600);

        setTyping(true);
        for (let i = 1; i <= DOMAIN.length; i++) {
          if (dead) return;
          setDomain(DOMAIN.slice(0, i));
          await sleep(70);
        }
        setTyping(false);
        await sleep(500);

        for (let s = 1; s <= 4; s++) {
          if (dead) return;
          setStep(s);
          await sleep(s === 4 ? 3800 : 1000);
        }
      }
    })();

    return () => {
      dead = true;
    };
  }, [live, reduced]);

  const connected = step === 4;
  const busy = step > 0 && step < 4;

  return (
    <div
      ref={ref}
      className={`dm ${connected ? "dm--live" : ""}`}
      aria-label="Custom domain mapping demo"
    >
      <div className="dm-col">
        <p className="dm-label">Your domain</p>
        <div className={`dm-input ${typing ? "is-focus" : ""}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
          </svg>
          <span className="dm-input-text">
            {domain || <em>yourname.com</em>}
            {typing && <i className="cf-caret" />}
          </span>
        </div>
        <div
          className={`dm-btn ${busy ? "is-busy" : ""} ${connected ? "is-ok" : ""}`}
        >
          {busy ? (
            <>
              <span className="cf-spin" /> Connecting
            </>
          ) : connected ? (
            "Connected"
          ) : (
            "Connect domain"
          )}
        </div>
        <div className="dm-rec">
          <span>
            <b>Type</b>CNAME
          </span>
          <span>
            <b>Host</b>www
          </span>
          <span>
            <b>Points to</b>cname.orixaai.com
          </span>
        </div>
      </div>

      <ul className="dm-checks" aria-live="polite">
        {CHECKS.map((c, i) => {
          const state =
            step - 1 > i ? "done" : step - 1 === i ? "active" : "wait";
          return (
            <li key={c} className={`dm-check is-${state}`}>
              <span className="dm-check-ico">
                {state === "done" ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                ) : state === "active" ? (
                  <span className="cf-spin dm-spin" />
                ) : null}
              </span>
              {c}
            </li>
          );
        })}
      </ul>

      <div className="dm-browser">
        <div className="browser-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span className="dm-url">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`dm-lock ${connected ? "is-on" : ""}`}
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 018 0v3" />
            </svg>
            <span key={connected ? "c" : "s"} className="dm-url-text">
              {connected ? DOMAIN : SUBDOMAIN}
            </span>
          </span>
        </div>
        <div className="dm-view">
          <Thumb t={TEMPLATES[4]} />
          <span className={`dm-live ${connected ? "is-on" : ""}`}>● Live</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── section ───────────────────────── */

export default function PillarsSection() {
  return (
    <section id="pillars" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-muted-foreground">
            What you get
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
            Built for people who are{" "}
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
              tired of generic portfolios.
            </span>
          </h2>
        </div>

        {/* Panels */}
        <div className="mt-14 grid gap-5 md:gap-6">
          <Panel
            title="Resume in. Portfolio out."
            sub="Upload your CV. AI fills in your experience, skills and education, then you choose a design. No typing every field."
          >
            <ResumeFlow />
          </Panel>

          <div className="grid gap-5 md:gap-6 lg:grid-cols-2">
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

          <Panel
            title="Custom Domain Mapping"
            sub="Connect your own custom domain name effortlessly to brand your personal portfolio."
          >
            <DomainDemo />
          </Panel>
        </div>
      </div>

     
    </section>
  );
}
