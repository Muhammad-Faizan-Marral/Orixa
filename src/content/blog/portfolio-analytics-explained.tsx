import Link from "next/link";
import type { BlogArticle } from "./types";

const article: BlogArticle = {
  slug: "portfolio-analytics-explained",
  title: "Portfolio Analytics Explained: What Should You Track?",
  excerpt:
    "Learn how to interpret portfolio views, unique visitors, referral sources, project clicks, contact clicks, and messages without treating every number as a hiring signal.",
  category: "Portfolio growth",
  publishedAt: "2026-10-14",
  readingTime: "6 min read",
  featuredLabel: "Measure interest, not vanity",
  content: [
    {
      heading: "Portfolio analytics should help you make a decision",
      paragraphs: [
        "Portfolio analytics can help you understand whether people are reaching your work and which parts they explore. The purpose is not to collect as many numbers as possible. It is to identify a useful next action: improve a project description, share your portfolio with a more relevant audience, or make the contact path easier to find.",
        "Analytics are signals, not proof of hiring interest. A visit does not mean a recruiter read every section, and a missing referrer does not necessarily mean someone arrived directly. Interpret trends alongside the context of where and when you shared the link.",
      ],
    },
    {
      heading: "The core metrics and what they can tell you",
      subsections: [
        {
          heading: "Total views and unique visitors",
          paragraphs: [
            "Total views indicate how many visits your analytics system recorded in the selected period. Unique visitors estimate how many distinct visitors were represented by the available identifiers. Different tools use different counting and filtering methods, so numbers may not match perfectly across services.",
          ],
        },
        {
          heading: "Recent activity",
          paragraphs: [
            "A seven-day or thirty-day view can help you compare activity before and after sharing an updated portfolio. Avoid drawing conclusions from a very small sample; check a longer period when traffic is low or irregular.",
          ],
        },
        {
          heading: "Traffic sources and referrers",
          paragraphs: [
            "Referral information can help show which websites or campaigns sent visits. Referrer information may be absent because of browser privacy settings, security policies, redirects, or messaging apps. Treat unknown or direct traffic as an incomplete category, not a precise attribution.",
          ],
        },
        {
          heading: "Countries and devices",
          paragraphs: [
            "Geographic and device breakdowns can give broad context about your audience. They are more useful when you have enough activity to see a pattern and should not be used to identify an individual visitor.",
          ],
        },
        {
          heading: "Project clicks, contact clicks, and messages",
          paragraphs: [
            "These actions can give more context than a page view alone. Project clicks show which project links attracted attention; contact clicks show interactions with a contact path; and recorded messages show that a visitor used the messaging flow. They still do not explain a visitor's intent, so combine them with feedback and your own outreach context.",
          ],
        },
      ],
    },
    {
      heading: "A simple weekly review",
      bullets: [
        "Check total views and unique visitors for the last seven days, then compare them with the previous period if you have enough data.",
        "Look at referral sources after sharing the portfolio on a new platform or sending applications.",
        "Check which project links attract clicks and make sure those projects are easy to understand and open correctly.",
        "Test the contact flow and check whether the contact-click and message counts make sense for the product's event definitions.",
        "Make one small improvement at a time, then observe the trend rather than changing everything at once.",
      ],
    },
    {
      heading: "Portfolio analytics in OrixaAI",
      paragraphs: [
        <>
          OrixaAI&apos;s portfolio analytics dashboard includes tracked visitors,
          unique visitors, seven-day and thirty-day activity, countries, traffic
          sources, project clicks, contact clicks, and messages. It also
          surfaces available insights such as the top traffic source, most
          viewed project, and most active country. See the
          <Link href="/portfolio-analytics" className="text-primary underline-offset-4 hover:underline"> analytics feature overview</Link>
          for context, and check your own dashboard for the metrics available
          to your portfolio.
        </>,
        "Analytics availability depends on the events and data that can actually be collected. Low traffic, missing referrer data, blockers, or privacy choices can leave some breakdowns empty. Do not treat a small number of visits as a statistically reliable trend.",
      ],
    },
    {
      heading: "Do not forget privacy and consent",
      paragraphs: [
        "Collect only the information needed to provide useful analytics, describe your practices accurately, and follow the legal requirements that apply to your users and locations. Avoid trying to identify visitors personally from aggregated information. Review your site's privacy notice and analytics configuration when the implementation changes.",
      ],
    },
    {
      heading: "Turn the report into an improvement",
      paragraphs: [
        "If visits are low, consider where you share your portfolio and whether the link is easy to find. If people visit but rarely open projects, improve the first screen and make the strongest work obvious. If project clicks are healthy but contact actions are low, check that the contact method is clear and works on mobile. These are hypotheses to test, not guaranteed explanations.",
        <>
          For practical guidance on presenting your strongest projects, read
          <Link href="/blog/how-to-build-developer-portfolio" className="text-primary underline-offset-4 hover:underline"> how to build a developer portfolio</Link>.
          If you are choosing a tool, our guide to the
          <Link href="/blog/best-portfolio-builder-for-developers" className="text-primary underline-offset-4 hover:underline"> best portfolio builder for developers</Link>
          explains which capabilities to compare.
        </>,
      ],
    },
  ],
};

export default article;
