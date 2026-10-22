import Link from "next/link";
import type { BlogArticle } from "./types";

const article: BlogArticle = {
  slug: "custom-domain-portfolio",
  title: "How to Add a Custom Domain to Your Portfolio Website",
  excerpt:
    "Learn what a custom domain does for a developer portfolio, what to prepare before connecting one, how DNS setup works, and how to make your portfolio easier to find and share.",
  category: "Portfolio publishing",
  publishedAt: "2026-10-22",
  readingTime: "6 min read",
  featuredLabel: "Give your portfolio a memorable address",
  content: [
    {
      heading: "What is a custom domain for a portfolio?",
      paragraphs: [
        "A custom domain is a web address you register and control, such as yourname.dev or yourname.com. Instead of sharing a long or platform-specific portfolio URL, you can share an address that is easy to remember and fits your professional identity.",
        "The domain is the address, not the portfolio content itself. You still need a published portfolio, useful project information, working links, and a reliable place to host the page. A custom domain makes the address more personal; it does not automatically improve search rankings.",
      ],
    },
    {
      heading: "Why use a custom domain for your developer portfolio?",
      bullets: [
        "Professional branding: use a consistent name across your resume, LinkedIn profile, proposals, and portfolio.",
        "Easy sharing: give recruiters, clients, and collaborators a short address they can remember and type.",
        "Long-term consistency: keep control of the domain registration and renewal, even if your portfolio content changes over time.",
        "A clearer public identity: use one primary portfolio address instead of repeatedly sharing different preview or draft links.",
      ],
    },
    {
      heading: "What to prepare before connecting a domain",
      bullets: [
        "A published OrixaAI portfolio. The custom-domain flow requires the portfolio to be published first.",
        "An active OrixaAI Premium plan. Custom domains require an active Premium subscription.",
        "A domain you own and access to its DNS settings at your domain registrar or DNS provider.",
        "A little care with existing DNS records. If your domain is also used for email or another service, do not delete unrelated records while making changes.",
      ],
    },
    {
      heading: "How to connect a custom domain to an OrixaAI portfolio",
      subsections: [
        {
          heading: "1. Publish the portfolio you want to use",
          paragraphs: [
            "Finish the portfolio content and publish it before attaching a domain. Check the public page first: confirm that your name, project descriptions, contact path, and links are correct on both desktop and mobile.",
          ],
        },
        {
          heading: "2. Open the Custom domain setting",
          paragraphs: [
            "Open the portfolio's settings in OrixaAI and find the Custom domain section. Enter the domain you own. Use the domain setup screen as the source of truth for the next steps, because the DNS records required for a domain can vary.",
          ],
        },
        {
          heading: "3. Add the DNS records shown in OrixaAI",
          paragraphs: [
            "Sign in to the service where your domain's DNS is managed and add the exact records shown by OrixaAI. Copy each record's type, host or name, and value carefully. Avoid replacing unrelated records, especially MX records used for email.",
          ],
        },
        {
          heading: "4. Check verification and test the live address",
          paragraphs: [
            "Return to OrixaAI and check the domain status. DNS changes may take time to propagate, so a pending status does not always mean that you entered a record incorrectly. Once the domain is verified, open the HTTPS address in a private browser window and test the page, navigation, project links, and contact actions.",
          ],
        },
      ],
    },
    {
      heading: "Custom domain SEO checklist",
      paragraphs: [
        "A memorable address is only one part of search readiness. Make sure the portfolio itself clearly explains who you are, what you do, and which projects demonstrate your skills. Search engines need accessible, useful page content—not just a domain name.",
      ],
      bullets: [
        "Write a distinct page title and description that accurately reflect your role and portfolio.",
        "Use one clear main heading and descriptive headings for projects, experience, and skills.",
        "Give each important project enough context to explain the problem, your contribution, the tools used, and the outcome. Do not publish invented achievements or metrics.",
        "Check that the site works on mobile, loads reliably, and has no broken navigation or contact links.",
        "Review the canonical URL, robots or noindex settings, and sitemap behavior for the preferred public address. Avoid unintentionally presenting duplicate versions of the same page to search engines.",
        "Share the portfolio through relevant professional profiles and link to it naturally from places where your work is discussed.",
      ],
    },
    {
      heading: "Does a custom domain guarantee better Google rankings?",
      paragraphs: [
        "No. A custom domain does not guarantee higher rankings, more interviews, or new clients. Its main value is branding and a consistent address. Search visibility also depends on useful and original content, accessibility, technical setup, links, competition, and whether the page is eligible to be indexed.",
        "Do not fill a portfolio with repeated keywords just to target search engines. Use the terms a recruiter or client would naturally search for, then support them with genuine examples of your work. Keep the page helpful for people first.",
      ],
    },
    {
      heading: "Is a custom domain worth it for your portfolio?",
      paragraphs: [
        "A custom domain is especially useful when you are actively applying for roles, finding freelance clients, sharing case studies, or building a professional presence over time. If you are still drafting your first portfolio, start with accurate content and a reliable public page; connect a domain when you are ready to make that address part of your professional identity.",
        <>
          OrixaAI lets eligible users connect a domain they already own to a
          published portfolio with an active Premium plan. Explore the
          <Link href="/developer-portfolio-builder" className="text-primary underline-offset-4 hover:underline"> developer portfolio builder</Link>,
          compare the current options on the
          <Link href="/pricing" className="text-primary underline-offset-4 hover:underline"> pricing page</Link>,
          or read our guide on choosing the
          <Link href="/blog/best-portfolio-builder-for-developers" className="text-primary underline-offset-4 hover:underline"> best portfolio builder for developers</Link>.
          When your portfolio is ready, you can
          <Link href="/auth/signup" className="text-primary underline-offset-4 hover:underline"> create an OrixaAI account</Link>
          and review your setup before sharing it.
        </>,
      ],
    },
  ],
};

export default article;
