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
      description:"Real-time product analytics for B2B SaaS. Ingests 2M events/day with sub-second dashboards and anomaly alerts.",
      url: "https://example.com/northstar",
      technologies: ["Next.js", "ClickHouse", "Kafka", "TypeScript"],
      imageUrl:"data:image/jpeg;base64,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"
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
