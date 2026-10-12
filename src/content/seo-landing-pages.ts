export type SeoLandingSection = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
};

export type SeoLandingStep = {
  title: string;
  description: string;
};

export type SeoLandingFaq = {
  question: string;
  answer: string;
};

export type SeoLandingPageData = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  promise: string;
  outcomes: { title: string; description: string }[];
  sections: SeoLandingSection[];
  steps: SeoLandingStep[];
  faqs: SeoLandingFaq[];
};

export const SEO_LANDING_PAGES: Record<string, SeoLandingPageData> = {
  "developer-portfolio-builder": {
    slug: "developer-portfolio-builder",
    eyebrow: "For developers",
    title: "A developer portfolio builder built around your actual work",
    description:
      "Bring your projects, experience, skills, and profile links into a developer portfolio you can customize and publish without building a website from scratch.",
    promise:
      "Make it easier for recruiters, hiring managers, and clients to understand what you build, how you think, and how to contact you.",
    outcomes: [
      {
        title: "Show work with context",
        description:
          "Organize projects, skills, experience, and the story behind your work in one public place.",
      },
      {
        title: "Keep your workflow simple",
        description:
          "Start from resume details or enter your information manually, then shape the portfolio before publishing.",
      },
      {
        title: "Make the next step obvious",
        description:
          "Give visitors a direct contact form and a single portfolio URL to share in applications.",
      },
    ],
    sections: [
      {
        eyebrow: "Project storytelling",
        title: "More than a grid of project cards",
        description:
          "A useful developer portfolio gives each project enough context for someone to understand the problem, your contribution, and the result.",
        bullets: [
          "Bring project descriptions and experience together with your profile.",
          "Add links such as GitHub or live demos where they are relevant.",
          "Choose a visual direction without needing to code the site yourself.",
        ],
      },
      {
        eyebrow: "One shareable destination",
        title: "Connect your resume, skills, and work",
        description:
          "Share one public portfolio URL from a resume, job application, LinkedIn profile, or message instead of sending people through a scattered list of links.",
        bullets: [
          "Start with a PDF resume or enter details manually.",
          "Use a design that suits the kind of work you want to present.",
          "Publish when the content is ready and share the public link.",
        ],
      },
      {
        eyebrow: "After publishing",
        title: "See how people discover your work",
        description:
          "Portfolio analytics help you understand visits and traffic sources, while the contact form gives interested visitors a direct way to reach you.",
        bullets: [
          "Review portfolio views and available traffic breakdowns.",
          "Receive contact messages through your portfolio form.",
          "Update your content and republish when your work changes.",
        ],
      },
    ],
    steps: [
      {
        title: "Add your details",
        description:
          "Upload a resume PDF as a starting point or fill in your profile and projects manually.",
      },
      {
        title: "Shape the presentation",
        description:
          "Review your content, choose a design, and organize the sections you want visitors to see.",
      },
      {
        title: "Publish and share",
        description:
          "Publish the portfolio and use its public URL in applications, profiles, and outreach.",
      },
    ],
    faqs: [
      {
        question: "Do I need to know how to code to build my portfolio?",
        answer:
          "No. OrixaAI is designed to let you enter or upload your information, customize the presentation, and publish without building the website from scratch.",
      },
      {
        question: "Can I link my GitHub profile?",
        answer:
          "You can add relevant profile and project links, such as GitHub or a live demo, to help visitors explore your work. This is not an automatic GitHub repository sync.",
      },
      {
        question: "Can visitors contact me from the portfolio?",
        answer:
          "Yes. Published portfolios can provide a contact form so visitors can send a message to the portfolio owner.",
      },
      {
        question: "Is there a free plan?",
        answer:
          "Yes. OrixaAI has a free plan for starting a portfolio. Visit the pricing page for current plan limits and premium features.",
      },
    ],
  },

  "resume-to-portfolio": {
    slug: "resume-to-portfolio",
    eyebrow: "Resume to website",
    title: "Turn your resume into a portfolio website",
    description:
      "Use your resume as a starting point for a shareable portfolio. Upload a PDF or enter your details manually, then review and customize what you publish.",
    promise:
      "Your resume is useful source material, but a portfolio can give projects, skills, and experience more room and context than a document alone.",
    outcomes: [
      {
        title: "Start with what you have",
        description:
          "Use an existing PDF resume as a starting point or build your profile from manual entries.",
      },
      {
        title: "Make experience easier to explore",
        description:
          "Present your skills, projects, education, and professional story as a public website.",
      },
      {
        title: "Choose what to publish",
        description:
          "Review your details, customize the design, and decide whether to attach an existing resume or generate one from your form data.",
      },
    ],
    sections: [
      {
        eyebrow: "Use your resume as a starting point",
        title: "Avoid rebuilding your profile from a blank page",
        description:
          "If you already have a resume, it can help you get started. OrixaAI also supports a manual path for people who prefer to enter their information themselves.",
        bullets: [
          "Upload a PDF resume within the uploader's stated file limit.",
          "Check extracted details and improve them before publishing.",
          "Add project context and links that may not fit on a one-page resume.",
        ],
      },
      {
        eyebrow: "Keep control of the final result",
        title: "A starting point, not an automatic final draft",
        description:
          "AI-assisted structuring can speed up setup, but your portfolio should still reflect accurate dates, skills, project contributions, and outcomes. Review the content before it goes live.",
        bullets: [
          "Correct wording and factual details before publishing.",
          "Choose a design and adjust the information you want to show.",
          "Add profile links and a direct way for visitors to contact you.",
        ],
      },
      {
        eyebrow: "Resume and portfolio together",
        title: "Give people more than one way to understand your work",
        description:
          "The portfolio can present your story on the web. You can also attach an uploaded resume or choose to generate a PDF resume from the form details in the portfolio flow.",
        bullets: [
          "Share the portfolio link in applications or professional profiles.",
          "Keep a downloadable resume available when configured.",
          "Republish updates as your projects and experience grow.",
        ],
      },
    ],
    steps: [
      {
        title: "Upload or enter details",
        description:
          "Begin with a PDF resume or choose the manual option to enter your information yourself.",
      },
      {
        title: "Review and personalize",
        description:
          "Check your details, add project information, choose a design, and decide how your resume should appear.",
      },
      {
        title: "Publish your portfolio",
        description:
          "Publish when you're satisfied, then share the public URL with recruiters, clients, or collaborators.",
      },
    ],
    faqs: [
      {
        question: "What file type can I upload?",
        answer:
          "The current resume uploader accepts PDF files and displays a 5 MB maximum. Check the upload control for the current limit when you create your portfolio.",
      },
      {
        question: "Do I have to upload a resume?",
        answer:
          "No. You can choose the manual path and enter your profile and portfolio details yourself.",
      },
      {
        question: "Will my portfolio exactly copy my resume?",
        answer:
          "No. Your resume is a starting point. Review the extracted details, add project context, and customize your portfolio before publishing.",
      },
      {
        question: "Can I include a resume PDF on my portfolio?",
        answer:
          "The portfolio flow supports attaching an uploaded resume or generating a PDF from the form data, depending on the option you choose.",
      },
    ],
  },

  "ats-resume-builder": {
    slug: "ats-resume-builder",
    eyebrow: "Resume builder",
    title: "Create an ATS-friendly resume from your portfolio details",
    description:
      "Generate a clean PDF resume from your profile and form details, or attach an existing resume to your OrixaAI portfolio. Review every detail before applying.",
    promise:
      "A clear, straightforward resume helps people and software scan your experience. No resume tool can guarantee that every employer's applicant tracking system will accept or rank a document.",
    outcomes: [
      {
        title: "Start from your details",
        description:
          "Use the information you already entered for your profile and portfolio rather than beginning another blank form.",
      },
      {
        title: "Generate a PDF resume",
        description:
          "Choose the auto-generate option in the portfolio flow to build a PDF from your form data when you save.",
      },
      {
        title: "Keep the content accurate",
        description:
          "Review job titles, dates, skills, and experience yourself; automated formatting cannot verify your career history.",
      },
    ],
    sections: [
      {
        eyebrow: "Clear document structure",
        title: "Prioritize readable, relevant information",
        description:
          "A resume should make your experience easy to scan. Keep section headings conventional, use concise descriptions, and tailor the content to each role you apply for.",
        bullets: [
          "Use consistent job titles and dates.",
          "Describe your actual contribution to projects and outcomes.",
          "Include skills that are relevant and that you can discuss honestly.",
        ],
      },
      {
        eyebrow: "Connected to your portfolio workflow",
        title: "Generate a resume or attach an existing PDF",
        description:
          "OrixaAI's portfolio flow lets you choose between attaching an uploaded PDF and automatically generating a PDF resume from your form data.",
        bullets: [
          "Choose the resume option that fits your current document.",
          "Keep your portfolio details aligned with your resume.",
          "Share the portfolio URL when you want employers to explore your projects too.",
        ],
      },
      {
        eyebrow: "No ranking promises",
        title: "ATS-friendly does not mean ATS-guaranteed",
        description:
          "Applicant tracking systems differ by employer and configuration. A simple, text-based resume can help with readability, but relevance, accuracy, and the employer's own rules still matter.",
        bullets: [
          "Read the job description and use truthful, relevant terminology.",
          "Check the generated PDF before sending it.",
          "Follow each employer's requested file format and application instructions.",
        ],
      },
    ],
    steps: [
      {
        title: "Complete your profile",
        description:
          "Add your experience, education, skills, and other details through the portfolio flow.",
      },
      {
        title: "Choose the resume option",
        description:
          "Attach a PDF you already have or enable auto-generation from your form data.",
      },
      {
        title: "Review before applying",
        description:
          "Open the PDF, verify the facts, and follow the employer's specific application requirements.",
      },
    ],
    faqs: [
      {
        question: "Does OrixaAI guarantee that a resume will pass every ATS?",
        answer:
          "No. Applicant tracking systems vary, and no builder can guarantee a particular screening result. Review the document and follow the employer's instructions.",
      },
      {
        question: "Can I make a resume if I don't already have one?",
        answer:
          "Yes. In the portfolio flow, you can choose to generate a PDF resume from your form data when you save.",
      },
      {
        question: "Can I upload my existing resume instead?",
        answer:
          "Yes. The current resume flow supports uploading and attaching an existing PDF resume.",
      },
      {
        question: "Is the resume builder a separate product?",
        answer:
          "The resume options are part of the OrixaAI portfolio creation workflow, so you can work with your resume and portfolio details together.",
      },
    ],
  },

  "portfolio-analytics": {
    slug: "portfolio-analytics",
    eyebrow: "Understand your reach",
    title: "Portfolio analytics that help you understand your audience",
    description:
      "See how people discover your published portfolio with visitor views and available breakdowns for traffic sources, countries, devices, and project engagement.",
    promise:
      "Sharing a portfolio is only the start. Analytics can help you see whether people are visiting and which channels bring them to your work.",
    outcomes: [
      {
        title: "Track visits",
        description:
          "Review the recorded views for a published portfolio instead of guessing whether anyone opened the link.",
      },
      {
        title: "Understand acquisition",
        description:
          "Use available referrer and traffic-source reporting to see where visits are coming from.",
      },
      {
        title: "Compare audience signals",
        description:
          "Review available country, device, and project-engagement metrics to help decide what to improve next.",
      },
    ],
    sections: [
      {
        eyebrow: "Traffic overview",
        title: "Move beyond link clicks and guesswork",
        description:
          "When you share a portfolio in applications, on social profiles, or in outreach, its analytics can help you understand the attention the link receives.",
        bullets: [
          "Review recorded portfolio views.",
          "Inspect available traffic-source and referrer breakdowns.",
          "Use trends as context, not as a guarantee of hiring outcomes.",
        ],
      },
      {
        eyebrow: "Audience context",
        title: "See available geography and device signals",
        description:
          "The analytics interface surfaces available country and device breakdowns so you can get more context about how visitors access your portfolio.",
        bullets: [
          "Explore the countries represented in recorded visits.",
          "Review device breakdowns when data is available.",
          "Treat small samples as directional rather than definitive.",
        ],
      },
      {
        eyebrow: "Portfolio improvement",
        title: "Use engagement signals to refine your work",
        description:
          "Project engagement and contact interactions can help you decide which details deserve more clarity. Analytics describes activity; it does not identify every visitor personally.",
        bullets: [
          "Look at which project links receive engagement where tracked.",
          "Keep high-priority contact details easy to find.",
          "Update and republish your portfolio as your work develops.",
        ],
      },
    ],
    steps: [
      {
        title: "Publish your portfolio",
        description:
          "Analytics are tied to the public portfolio, so publish it before expecting real visit data.",
      },
      {
        title: "Share your link",
        description:
          "Use the URL in applications, professional profiles, communities, or direct outreach.",
      },
      {
        title: "Review available reports",
        description:
          "Use views and traffic breakdowns to inform changes to your portfolio and how you share it.",
      },
    ],
    faqs: [
      {
        question: "What can OrixaAI portfolio analytics show?",
        answer:
          "The product's analytics experience includes recorded views and available breakdowns such as traffic sources, countries, devices, and project engagement. The data shown depends on what has been recorded.",
      },
      {
        question: "Will analytics show the name of every visitor?",
        answer:
          "No. Traffic analytics should not be treated as personal identification of every visitor. It presents recorded activity and available aggregate breakdowns.",
      },
      {
        question: "Why is my analytics page empty?",
        answer:
          "The portfolio needs to be published and receive recorded visits before reports can show useful data. New or low-traffic portfolios may have limited information.",
      },
      {
        question: "Can analytics guarantee more job offers?",
        answer:
          "No. Analytics can help you understand traffic and engagement, but it cannot guarantee interviews, clients, or hiring outcomes.",
      },
    ],
  },

  "portfolio-templates": {
    slug: "portfolio-templates",
    eyebrow: "Portfolio design",
    title: "Portfolio designs for a more considered online presence",
    description:
      "Explore distinct portfolio design directions—from minimal and editorial to technical, glass-inspired, brutalist, and cinematic—and choose a presentation that fits your work.",
    promise:
      "A portfolio's design should help people understand your work. OrixaAI provides different visual directions and lets you shape the presentation around your content.",
    outcomes: [
      {
        title: "Pick a visual direction",
        description:
          "Explore distinct design styles rather than relying on a single generic layout.",
      },
      {
        title: "Match design to your work",
        description:
          "Use a quiet editorial presentation, a technical visual language, or a more expressive look where it fits.",
      },
      {
        title: "Preview before upgrading",
        description:
          "Preview available design directions, while applying premium designs requires an eligible premium plan.",
      },
    ],
    sections: [
      {
        eyebrow: "Free design directions",
        title: "Start with clean, useful foundations",
        description:
          "OrixaAI's free Design DNAs include Minimal Airy, Tech Dense, and Editorial. Each offers a different visual starting point for presenting your profile and projects.",
        bullets: [
          "Minimal Airy for a light, open layout.",
          "Tech Dense for a more technical, information-forward feel.",
          "Editorial for a publication-inspired presentation.",
        ],
      },
      {
        eyebrow: "Premium design directions",
        title: "More expressive styles when you need them",
        description:
          "Premium Design DNAs include Soft Luxury, Neo Glass, Brutalist, and Cinematic. Choose based on the work you want the portfolio to communicate, not just visual novelty.",
        bullets: [
          "Soft Luxury for a refined, warm visual tone.",
          "Neo Glass for layered, glass-inspired surfaces.",
          "Brutalist or Cinematic for a bolder visual point of view.",
        ],
      },
      {
        eyebrow: "Design with purpose",
        title: "A template is a starting point, not the strategy",
        description:
          "Strong portfolio content still matters: clear project descriptions, relevant experience, easy-to-find contact details, and a simple way to explore your work.",
        bullets: [
          "Use headings and project narratives that explain your contribution.",
          "Keep your contact path visible to potential clients or recruiters.",
          "Review the mobile and desktop presentation before sharing the URL.",
        ],
      },
    ],
    steps: [
      {
        title: "Add your portfolio content",
        description:
          "Start with a resume or enter your profile, skills, experience, and projects manually.",
      },
      {
        title: "Choose and customize a design",
        description:
          "Select an available Design DNA, review the result, and apply a premium design if your plan includes it.",
      },
      {
        title: "Publish when ready",
        description:
          "Check your content and public presentation, then publish and share your portfolio URL.",
      },
    ],
    faqs: [
      {
        question: "Which portfolio design styles are available?",
        answer:
          "The current Design DNAs include Minimal Airy, Tech Dense, Editorial, Soft Luxury, Neo Glass, Brutalist, and Cinematic.",
      },
      {
        question: "Can free users preview premium designs?",
        answer:
          "The product supports previewing all design directions, but applying premium Design DNAs requires the appropriate premium access.",
      },
      {
        question: "Does a premium template guarantee a better portfolio?",
        answer:
          "No. Visual design can support your presentation, but clear and accurate project content, relevant experience, and a usable contact path remain important.",
      },
      {
        question: "Do I need to code to customize my portfolio?",
        answer:
          "OrixaAI is designed for portfolio creation and design customization without requiring you to build the site from scratch in code.",
      },
    ],
  },
};
