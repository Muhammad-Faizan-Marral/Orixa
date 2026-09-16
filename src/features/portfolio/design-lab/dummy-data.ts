import type {
  PortfolioRenderConfig,
  PublicProfileMeta,
} from "@/portfolio-renderer/types";

export const LAB_PROFILE: PublicProfileMeta = {
  username: "demo",
  fullName: "Ava Chen",
  avatarUrl: null,
};

/** Rich dummy content so every section has something to render */
export const LAB_CONFIG_BASE: PortfolioRenderConfig = {
  name: "Ava Chen",
  headline: "Product Engineer · AI interfaces & design systems",
  about:
    "I build product experiences at the intersection of design and engineering. Previously shipped growth systems at early-stage startups, and now focus on AI-assisted creative tools. I care about clarity, motion that earns its place, and portfolios that feel intentional — not templated.",
  phone: "+1 415 555 0198",
  linkedinUrl: "https://linkedin.com/in/avachen",
  githubUrl: "https://github.com/avachen",
  avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSheEBDUNMMb-6PHYzfbK4QgACCFAgCLJ2Ys-nCYS1uaw&s=10",
  resumeUrl: null,
  animations: true,
  skills: [
    { id: "1", name: "TypeScript", level: "Expert" },
    { id: "2", name: "React", level: "Expert" },
    { id: "3", name: "Next.js", level: "Advanced" },
    { id: "4", name: "Node.js", level: "Advanced" },
    { id: "5", name: "PostgreSQL", level: "Advanced" },
    { id: "6", name: "Figma", level: "Advanced" },
    { id: "7", name: "System Design", level: "Intermediate" },
    { id: "8", name: "Python", level: "Intermediate" },
    { id: "9", name: "Tailwind CSS", level: "Expert" },
    { id: "10", name: "Framer Motion", level: "Advanced" },
    { id: "11", name: "GraphQL", level: "Intermediate" },
    { id: "12", name: "Playwright", level: "Intermediate" },
  ],
  projects: [
    {
      id: "p1",
      title: "Northstar Analytics",
      description:
        "Real-time product analytics for B2B SaaS. Ingests 2M events/day with sub-second dashboards and anomaly alerts.",
      url: "https://example.com/northstar",
      technologies: ["Next.js", "ClickHouse", "Kafka", "TypeScript"],
    },
    {
      id: "p2",
      title: "Canvas AI",
      description:
        "Collaborative whiteboard with AI layout suggestions. Reduced time-to-first-frame by 40% for design teams.",
      url: "https://example.com/canvas",
      technologies: ["React", "WebGL", "OpenAI", "Redis"],
    },
    {
      id: "p3",
      title: "Ledger Lite",
      description:
        "Founder-friendly bookkeeping with smart categorization and tax-ready exports.",
      url: "https://example.com/ledger",
      technologies: ["Next.js", "PostgreSQL", "Stripe"],
    },
    {
      id: "p4",
      title: "Pulse Status",
      description:
        "Beautiful public status pages with incident timelines and subscriber notifications.",
      technologies: ["Remix", "Tailwind", "Resend"],
    },
    {
      id: "p5",
      title: "Orbit CMS",
      description:
        "Headless CMS tuned for marketing sites — visual blocks, preview, and edge caching.",
      url: "https://example.com/orbit",
      technologies: ["Next.js", "Sanity", "Vercel"],
    },
    {
      id: "p6",
      title: "Harbor Auth",
      description:
        "Drop-in auth kit with passkeys, org roles, and audit logs for multi-tenant apps.",
      technologies: ["Go", "React", "PostgreSQL"],
    },
  ],
  experience: [
    {
      id: "e1",
      company: "Lumen Labs",
      role: "Senior Product Engineer",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "",
      current: true,
      description:
        "Lead engineer on the design-system and growth surfaces. Shipped experiment framework used across 12 product teams.",
    },
    {
      id: "e2",
      company: "Stackfield",
      role: "Full-Stack Engineer",
      location: "Remote",
      startDate: "2019-06",
      endDate: "2022-02",
      current: false,
      description:
        "Built billing, onboarding, and admin console. Cut activation time from 3 days to same-day.",
    },
    {
      id: "e3",
      company: "Freelance",
      role: "Product Designer & Developer",
      location: "Remote",
      startDate: "2017-01",
      endDate: "2019-05",
      current: false,
      description:
        "Shipped marketing sites and MVPs for early-stage founders — from brand to deploy.",
    },
  ],
  education: [
    {
      id: "ed1",
      institution: "University of Washington",
      degree: "B.S.",
      field: "Computer Science",
      startDate: "2013",
      endDate: "2017",
    },
    {
      id: "ed2",
      institution: "Interaction Design Certificate",
      degree: "Certificate",
      field: "HCI",
      startDate: "2018",
      endDate: "2018",
    },
  ],
  certificates: [
    {
      id: "c1",
      name: "AWS Solutions Architect",
      issuer: "Amazon Web Services",
      issueDate: "2023",
    },
    {
      id: "c2",
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      issueDate: "2021",
    },
    {
      id: "c3",
      name: "Google UX Design",
      issuer: "Google",
      issueDate: "2020",
    },
  ],
};
