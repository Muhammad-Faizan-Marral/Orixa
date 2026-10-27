/**
 * Server Component: native <details>/<summary> gives keyboard + screen-reader
 * support for free, ships zero JS, and keeps every answer in the HTML so it can
 * be indexed. `name="faq"` makes it a one-open-at-a-time accordion in browsers
 * that support it; elsewhere each item simply toggles independently.
 */

const faqs = [
  {
    q: "What is OrixaAI?",
    a: "OrixaAI helps you turn projects, experience, skills and resume into a personalized portfolio you can publish and share.",
  },
  {
    q: "Do I need coding skills?",
    a: "No. The entire create → customize → publish flow works without writing any code.",
  },
  {
    q: "Can I use my resume?",
    a: "Yes. Upload a supported resume and OrixaAI will help structure the information. Always review before publishing.",
  },
  {
    q: "Can I preview Premium designs?",
    a: "Yes. Design Lab lets you explore free and Premium themes before applying them.",
  },
  {
    q: "Is OrixaAI free?",
    a: "You can start completely free. Premium unlocks watermark removal and all Premium designs.",
  },
  {
    q: "Can I get a discount?",
    a: "There is a hidden code on this page. Find all 5 digits and apply it on the Yearly plan for $9 off the first year.",
  },
  {
    q: "How does the referral reward work?",
    a: "Invite 20 people who each successfully publish a portfolio. You unlock one year of Premium.",
  },
  {
    q: "Can I connect my own domain?",
    a: "Yes, you can add your own custom domain to every portfolio.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[0.75fr_1.25fr] md:gap-16">
        {/* Left column */}
        <div className="max-w-sm">
          <p className="mb-3 text-sm font-medium tracking-wide text-muted-foreground">
            FAQ
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.6rem] md:leading-[1.15]">
            Questions,{" "}
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
              answered.
            </span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-2.5">
          {faqs.map((faq, i) => (
            <details
              key={faq.q}
              name="faq"
              open={i === 0}
              className="group overflow-hidden rounded-xl border border-border/60 bg-background/40 transition-colors open:bg-background/60"
            >
              <summary className="flex min-h-[3.5rem] w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left">
                <h3 className="text-[15px] font-medium text-foreground">
                  {faq.q}
                </h3>
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/70 text-sm text-muted-foreground transition-transform duration-200 group-open:rotate-45 group-open:border-foreground/30 group-open:text-foreground"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}