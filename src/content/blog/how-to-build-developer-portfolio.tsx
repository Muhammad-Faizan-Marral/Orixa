import Link from "next/link";
import type { BlogArticle } from "./types";

const article: BlogArticle = {
  slug: "how-to-build-developer-portfolio",
  title: "How to Build a Developer Portfolio",
  excerpt:
    "A developer portfolio should make your strongest work easy to understand. Start with a clear introduction, choose a few meaningful projects, explain your contribution, and make it simple for people to contact you.",
  category: "Developer guide",
  publishedAt: "2026-10-08",
  readingTime: "8 min read",
  featuredLabel: "A step-by-step guide",
  content: [
    {
      heading: "Decide what your portfolio needs to do",
      paragraphs: [
        "A developer portfolio gives someone a quick way to understand your focus, see evidence of your work, and decide what to explore next. It can support a job search, freelance conversations, or simply make your projects easier to share. It does not need to represent every line of code you have written.",
        "Before choosing a template or writing an introduction, think about the reader and the next step you want to make clear: open a project, visit your GitHub profile, read your resume, or contact you. A focused portfolio helps a visitor find those things without guesswork.",
      ],
    },
    {
      heading: "Start with a clear introduction",
      paragraphs: [
        "Your opening section should identify you and the kind of development you do. Include your name, a plain-language description of your focus, and one or two useful links. “Frontend developer building accessible interfaces with React” tells a visitor more than a broad claim like “passionate problem solver.”",
        "Keep the opening concise. You can add background and detail in an About section, while the first screen directs visitors to the work that best represents you.",
      ],
    },
    {
      heading: "Choose projects that show how you work",
      paragraphs: [
        "Select a small set of projects that demonstrate relevant skills, sound decisions, or a range of experience. A finished personal project can be valuable if it explains a real problem and your process. A class or team project can also belong, provided you describe its context and your own contribution accurately.",
      ],
      subsections: [
        {
          heading: "Explain the project, not only the technology",
          paragraphs: [
            "For each project, cover the problem or goal, who it served, your role, the approach you took, and what you learned or delivered. Mention the stack where it helps a reader understand the implementation, but do not make a list of tools carry the whole explanation.",
          ],
        },
        {
          heading: "Make your contribution explicit",
          paragraphs: [
            "If other people worked on the project, say what you owned. For a group build, that could be the API design, a particular interface, test coverage, or deployment setup. Clear attribution gives appropriate credit and lets a reader assess your work fairly.",
          ],
        },
        {
          heading: "Link to evidence when you can",
          paragraphs: [
            "Add a live demo, repository, short walkthrough, or relevant screenshots where available. Check that links work and that a public repository does not expose secrets or private data. If a project cannot be shared publicly, explain the constraint and describe your role without revealing confidential details.",
          ],
        },
      ],
    },
    {
      heading: "Include the context that supports your work",
      subsections: [
        {
          heading: "About, skills, and experience",
          paragraphs: [
            "Use an About section for relevant background and the kinds of problems you enjoy working on. List skills you can discuss with confidence, and connect them to projects or roles. If you have professional or volunteer experience, summarize responsibilities and contributions in concrete language rather than copying a full job description.",
          ],
        },
        {
          heading: "Education and certifications",
          paragraphs: [
            "Include education, coursework, or certifications when they help explain your preparation or current direction. They are useful context, not a requirement for every portfolio. Early-career developers can highlight substantial learning projects; experienced developers can keep older or less relevant details brief.",
          ],
        },
        {
          heading: "GitHub and other relevant links",
          paragraphs: [
            "Link to GitHub or another code-hosting profile if it contains work you are comfortable sharing. Pin or point to the repositories that make the best first impression, add a useful README, and remove broken links. Include other professional profiles only if they add context rather than noise.",
          ],
        },
        {
          heading: "Resume and contact",
          paragraphs: [
            "A resume link can help someone who wants a conventional summary, but it should be optional to navigate the portfolio. Give visitors a clear contact method—such as a professional email address or a contact form—and check where messages are sent. Avoid publishing private personal details you do not need to share.",
          ],
        },
      ],
    },
    {
      heading: "Choose a visual presentation that supports the content",
      paragraphs: [
        "A portfolio does not need elaborate effects to feel considered. Use readable type, consistent spacing, useful contrast, and a layout that makes project titles and descriptions easy to scan. Screenshots should show the work at a useful size, and code examples should be short enough to read on a phone.",
        "Choose a presentation that suits your work and remains usable. A frontend developer may include interface screenshots, while a backend developer might use a simple architecture diagram or a concise description of system behavior. Keep motion optional and avoid design choices that make essential text difficult to read.",
      ],
    },
    {
      heading: "Publish, test, and share",
      paragraphs: [
        "Before sharing your portfolio, open it on a phone and a desktop, follow every link, and read it for spelling and factual accuracy. Check that public projects contain no credentials, customer information, or material you lack permission to publish. If you use a public profile URL, make sure it is easy to say and share.",
        "Send the portfolio with a short, relevant note rather than relying on someone to discover it. Keep it current when you complete work that changes the story you want to tell. OrixaAI can help organize profile and project information, choose a theme in Design Lab, and publish a portfolio; it is one option, not a substitute for selecting and reviewing your work.",
      ],
    },
    {
      heading: "Common mistakes to avoid",
      bullets: [
        "Adding many unfinished projects instead of selecting a few that explain your strengths.",
        "Listing technologies without showing where or how you used them.",
        "Using vague claims that do not give a reader a way to understand your contribution.",
        "Publishing broken demo links, empty repositories, confidential details, or uncredited team work.",
        "Overloading the page with animation or visual effects that compete with the content.",
        "Leaving out contact information or a clear next step.",
      ],
    },
    {
      heading: "A practical launch checklist",
      bullets: [
        "The introduction says who you are and what kind of development you do.",
        "Your strongest projects appear first and explain your role and decisions.",
        "Project, GitHub, resume, and contact links work as intended.",
        "Skills and experience are accurate and supported by examples where possible.",
        "The page is readable on mobile and does not require horizontal scrolling.",
        "You have reviewed spelling, permissions, privacy, and every public claim.",
      ],
    },
    {
      heading: "Keep it focused and keep it yours",
      paragraphs: [
        "The best developer portfolio for you is one that makes your actual work easier to understand. Begin with a clear introduction, give a few projects the context they deserve, and remove anything that makes the important information harder to find. Improve it as your experience grows rather than waiting for a perfect first version.",
        <>
          If you want a structured place to bring profile details and projects
          together,{" "}
          <Link href="/auth/signup" className="text-primary underline-offset-4 hover:underline">
            start a portfolio with OrixaAI
          </Link>
          . You can also browse{" "}
          <Link href="/blog/developer-portfolio-examples" className="text-primary underline-offset-4 hover:underline">
            portfolio examples by developer focus
          </Link>
          .
        </>,
      ],
    },
  ],
};

export default article;
