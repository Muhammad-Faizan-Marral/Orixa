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
    <section id="faq" className="lp">
      <div className="lp-container">
        <div className="lp-head">
          <h2 className="lp-title">Questions, answered.</h2>
          <p className="lp-lead">Everything you need to know about OrixaAI.</p>
        </div>

        <div className="lp-faq-list">
          {faqs.map((faq, i) => (
            <details key={faq.q} name="faq" open={i === 0} className="lp-faq">
              <summary>
                <h3 style={{ fontSize: "inherit", fontWeight: "inherit" }}>{faq.q}</h3>
                <svg className="lp-faq-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <div className="lp-faq-body">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
