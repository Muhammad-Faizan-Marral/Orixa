import Link from "next/link";
import type { BlogArticle } from "./types";

const article: BlogArticle = {
  slug: "what-is-an-ai-portfolio",
  title: "What Is an AI Portfolio?",
  excerpt:
    "An AI portfolio is more than a page written by a chatbot. It brings your projects, skills, experience, and story into a clear portfolio—with AI helping you shape the material and you making the final calls.",
  category: "Portfolio fundamentals",
  publishedAt: "2026-10-08",
  readingTime: "6 min read",
  featuredLabel: "A practical introduction",
  content: [
    {
      heading: "What people mean by an AI portfolio",
      paragraphs: [
        "An AI portfolio is a professional portfolio created or improved with help from artificial intelligence. The term can describe a few different things: a portfolio that uses AI in its creation, a portfolio that presents AI-related work, or a website that includes AI features. For most people building a personal site, it means the first—using AI as an assistant while organizing and presenting real work.",
        "The portfolio itself still needs to communicate who you are, what you can do, and what you have actually made. AI can help you get from raw notes to a first draft, but the substance should come from your experience and your judgment.",
      ],
    },
    {
      heading: "AI-assisted creation is not just generating a website",
      paragraphs: [
        "A site generator can produce a layout and fill it with plausible-sounding copy. That may be a quick start, but a polished-looking page is not automatically a useful portfolio. Generic descriptions, invented accomplishments, and projects without context make it harder for a reader to understand your contribution.",
        "AI-assisted portfolio creation is more deliberate. It can help organize your information, suggest clearer wording, and turn a rough project outline into a draft. You provide the facts, decide what belongs, and review the result. The aim is to make your own work easier to understand—not to make up a professional identity for you.",
      ],
    },
    {
      heading: "Why structured information matters",
      paragraphs: [
        "A portfolio is easier to build and maintain when information has a clear structure. A project might include its purpose, your role, the tools you used, the decisions you made, and the result. Experience can be organized by role and dates; skills can be connected to examples rather than presented as an unexplained list.",
        "That structure helps both people and software work with your content. It gives an AI assistant useful context and makes it easier to reuse information across an introduction, project page, or resume. It also helps visitors scan a portfolio without having to infer how everything fits together.",
      ],
    },
    {
      heading: "How AI can help with resumes and project notes",
      subsections: [
        {
          heading: "Turn rough notes into a useful first draft",
          paragraphs: [
            "You might start with notes such as “rebuilt checkout,” “worked with two designers,” or “cut the steps from five to three.” An AI assistant can help turn those notes into a readable project summary, ask what is missing, or suggest a clearer order. You still need to confirm that the summary accurately describes what happened and what you did.",
          ],
        },
        {
          heading: "Find portfolio material in a resume",
          paragraphs: [
            "A resume can be a helpful source for roles, dates, skills, and projects you may want to expand on. Optional resume parsing can help extract that information so you do not have to start from a blank page. Extraction can miss details or misread formatting, so treat it as a draft to check—not as an authoritative record.",
          ],
        },
        {
          heading: "Keep the writing specific to you",
          paragraphs: [
            "Good assistance should preserve details that make your work distinct: the constraint you worked around, the trade-off you made, or the part you owned. If the result could describe almost anyone in the same field, add concrete facts or rewrite it in your own voice.",
          ],
        },
      ],
    },
    {
      heading: "Examples for different kinds of work",
      paragraphs: [
        "A developer could use AI to organize a project explanation around the problem, technical approach, and personal contribution. A designer might start with research notes and use an assistant to draft a concise case-study outline. A student could gather coursework, team projects, and independent experiments into a coherent starting portfolio. A freelancer might clarify the scope and outcomes of selected client work, while checking that client permissions allow it to be shared.",
        "In each case, the strongest portfolio is grounded in work the person can discuss and verify. AI can make the editing process less daunting; it cannot supply missing evidence or replace permission to publish someone else’s material.",
      ],
    },
    {
      heading: "Review before you publish",
      paragraphs: [
        "Read every generated sentence as if a hiring manager, collaborator, or client asked you to explain it. Verify names, dates, tools, metrics, and claims about your role. Remove confidential information, private contact details, and content you do not have permission to share. Make sure the final portfolio reflects your actual skills and experience.",
        "This review matters especially when a resume or other personal document is involved. Upload only material you are comfortable processing through the service, and check any extracted information before it becomes part of a public page.",
      ],
    },
    {
      heading: "Building an AI-assisted portfolio with care",
      paragraphs: [
        <>
          OrixaAI is one practical way to bring profile details and project
          information into a structured portfolio, choose a presentation in
          Design Lab, and publish a public page. Its AI-assisted steps are
          intended to help with drafting and organization; you remain
          responsible for reviewing what you publish. You can compare available
          plans on the{" "}
          <Link href="/pricing" className="text-primary underline-offset-4 hover:underline">
            pricing page
          </Link>
          .
        </>,
      ],
    },
    {
      heading: "The useful version of an AI portfolio",
      paragraphs: [
        "A useful AI portfolio does not try to hide the person behind generated copy. It makes relevant work easier to find, gives each project enough context, and presents information in a way that feels accurate. Let AI help you organize and edit; let your experience, evidence, and decisions lead the story.",
        <>
          Ready to bring your work together?{" "}
          <Link href="/auth/signup" className="text-primary underline-offset-4 hover:underline">
            Create a portfolio with OrixaAI
          </Link>{" "}
          and review each detail before it goes public.
        </>,
      ],
    },
  ],
};

export default article;
