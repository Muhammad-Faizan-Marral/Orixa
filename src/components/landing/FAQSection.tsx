/**
 * Server Component: native <details>/<summary> gives keyboard + screen-reader
 * support for free, ships zero JS, and keeps every answer in the HTML so it can
 * be indexed. `name="faq"` makes it a one-open-at-a-time accordion in browsers
 * that support it; elsewhere each item simply toggles independently.
 */
const faqs = [
  { q: "What is OrixaAI?", a: "OrixaAI helps you turn projects, experience, skills and resume into a personalized portfolio you can publish and share." },
  { q: "Do I need coding skills?", a: "No. The entire create → customize → publish flow works without writing any code." },
  { q: "Can I use my resume?", a: "Yes. Upload a supported resume and OrixaAI will help structure the information. Always review before publishing." },
  { q: "Can I preview Premium designs?", a: "Yes. Design Lab lets you explore free and Premium themes before applying them." },
  { q: "Is OrixaAI free?", a: "You can start completely free. Premium unlocks watermark removal and all Premium designs." },
  { q: "Can I get a discount?", a: "There is a hidden code on this page. Find all 5 digits and apply it on the Yearly plan for $9 off the first year." },
  { q: "How does the referral reward work?", a: "Invite 20 people who each successfully publish a portfolio. You unlock one year of Premium." },
  { q: "Can I connect my own domain?", a: "Custom domains are not available yet. Every portfolio currently uses an OrixaAI public URL." },
];

export default function FAQSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="text-caption mb-3">FAQ</p>
          <h2 className="text-h1">Questions, <span className="text-gradient-ion">answered.</span></h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={faq.q} name="faq" open={i === 0} className="faq surface-card overflow-hidden">
              <summary className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-medium">
                <h3 className="font-medium">{faq.q}</h3>
                <span className="faq-sign font-mono text-xl text-accent" aria-hidden="true" />
              </summary>
              <div className="text-body px-5 pb-5 text-muted-foreground">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
