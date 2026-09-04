import { DesignEngine } from "@/portfolio-renderer/DesignEngine";

export default async function Testing() {

  const pub = {
    seo: {
      title: "jkl",
      noIndex: false,
      keywords: [],
      description: "",
    },
    name: "faizan",
    about:
      "Frontend Developer specializing in Next.js, React, and modern JavaScript ecosystems. Experienced in building scalable, performant web applications with strong UI/UX focus. Skilled in state management, API integration, and SaaS-based architectures. Also experienced in prompt engineering for AI-driven applications.",
    phone: "+92 3498289100",
    theme: "minimal",
    prompt: "green+yellow",
    skills: [
      {
        id: "961cb0e8-5b5a-411e-9638-0eabda73b2aa",
        name: "Frontend",
        level: "",
      },
      {
        id: "41f8cbeb-a430-4b6b-8422-a723bf8c134f",
        name: "State Management",
        level: "",
      },
      {
        id: "be67fa74-852d-4238-89d3-73f9c341d821",
        name: "Tools",
        level: "",
      },
    ],
    headline: "Frontend",
    projects: [
      {
        id: "99701db0-cb2e-4bd5-a31e-e32a0c0e1e43",
        url: "",
        title: "E-Commerce Web Application",
        imageUrl: "",
        description:
          "Developed a feature-rich e-commerce platform with authentication, product listing, pagination, wishlist, cart, and billing system. Implemented efficient state management and API integration.",
        technologies: [
          "Next.js",
          "TypeScript",
          "Redux Toolkit",
          "TanStack Query",
          "TailwindCSS",
        ],
      },
      {
        id: "b9ba3083-947f-431b-9b81-ecc9e4fe158b",
        url: "",
        title: "GenUI (SaaS Concept)",
        imageUrl: "",
        description:
          "Built a SaaS platform that generates UI from prompts with live deployment and shareable URLs. Integrated APIs and Supabase for backend and real-time data handling.",
        technologies: ["Next.js", "JavaScript", "Supabase", "TailwindCSS"],
      },
      {
        id: "85aa60f3-cb6b-4f39-847f-6d44fda6b6a6",
        url: "",
        title: "Interactive Website Clone",
        imageUrl: "",
        description:
          "Recreated an award-winning interactive website using advanced GSAP animations and smooth UI transitions.",
        technologies: ["React", "GSAP", "Vite", "TailwindCSS"],
      },
      {
        id: "0f810993-846d-40ff-90f6-fa74462cba4d",
        url: "",
        title: "PixelMind AI",
        imageUrl: "",
        description:
          "Developed an AI-based application with object detection, face emotion detection, and image analysis capabilities using integrated models.",
        technologies: ["Next.js", "TailwindCSS"],
      },
    ],
    avatarUrl: null,
    education: [
      {
        id: "6f7e7be7-044f-4390-93ca-9a04f338d150",
        field: "",
        degree: "Bachelor of Computer Science",
        endDate: "2025",
        startDate: "2021",
        description: "",
        institution: "2021",
      },
    ],
    githubUrl: "https://github.com/Muhammad-Faizan-Marral",
    resumeUrl:
      "https://qdbzhkrcowxrmdsaxfio.supabase.co/storage/v1/object/public/portfolio-public/portfolios/22d782f0-0ec0-4f21-8942-cb87b487735d/cd8c0e53-db02-4cac-aeb1-07b3bf857304/resume/generated-1788455168647.pdf",
    animations: true,
    experience: [
      {
        id: "80c8a705-6dd5-4305-b3df-2bd560b96fa9",
        role: "Web Development Intern",
        company: "PostgreSQL",
        current: false,
        endDate: "07/2024",
        location: "Pakistan",
        startDate: "04/2024",
        description: "",
      },
    ],
    linkedinUrl: "https://linkedin.com/in/muhammad-faizan-05093b2a4",
    certificates: [
      {
        id: "f4e72edb-afe1-44a9-bacc-c2fce3140765",
        name: "Git",
        issuer: "Bachelor",
        issueDate: "GitHub",
        credentialUrl: "",
      },
    ],
    designPreferences: {
      layout: "wide",
      cardStyle: "elevated",
      themeMode: "dark  ",
      fontFamily: "Inter",
      accentColor: "#0000ff",
      borderRadius: "medium",
    },
    componentSelection: {
      hero: { enabled: true, variant: "creative" },
      about: { enabled: true, variant: "split" },
      footer: { enabled: true, variant: "minimal" },
      navbar: { enabled: true, variant: "minimal" },
      skills: { enabled: true, variant: "grid" },
      contact: { enabled: true, variant: "form" },
      projects: { enabled: true, variant: "cards" },
      education: { enabled: true, variant: "simple" },
      experience: { enabled: true, variant: "cards" },
      certificates: { enabled: true, variant: "simple" },
    },
  };

  return (
    <>
      <DesignEngine
        config={pub}
        profile={{
          username: "Faizan",
          fullName: "Fa",
          avatarUrl: "empty",
        }}
      />
    </>
  );
}
