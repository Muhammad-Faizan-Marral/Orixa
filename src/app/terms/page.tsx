import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms that apply when you use OrixaAI.",
};

const sectionClass = "space-y-3";
const headingClass = "text-xl font-semibold tracking-tight text-foreground";
const paragraphClass = "leading-7 text-muted-foreground";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground sm:py-16">
      <article className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3">
          <Link href="/" className="text-sm text-primary hover:underline">
            OrixaAI
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: October 7, 2026
          </p>
          <p className={paragraphClass}>
            These terms explain the rules for using OrixaAI at orixaai.me. By
            creating an account or using the service, you agree to them. If you
            do not agree, do not use OrixaAI.
          </p>
        </header>

        <section className={sectionClass}>
          <h2 className={headingClass}>1. Agreement and eligibility</h2>
          <p className={paragraphClass}>
            You must be legally able to enter into a binding agreement where you
            live. If you use OrixaAI for an organization, you confirm that you
            can accept these terms on its behalf. You are responsible for
            following laws that apply to your use of the service.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>2. The service</h2>
          <p className={paragraphClass}>
            OrixaAI is an AI-assisted portfolio builder. You can create and
            manage portfolio content, publish public portfolio pages, view
            visitor and interaction analytics, and use Design Lab to choose
            portfolio themes and variants. Features and limits may differ
            between free and paid plans, and we may update the service over
            time.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>3. Accounts and security</h2>
          <p className={paragraphClass}>
            Keep your account information accurate and protect your sign-in
            credentials. You are responsible for activity under your account and
            should tell us promptly if you suspect unauthorized access. OrixaAI
            uses Supabase for authentication, including email and supported
            OAuth sign-in.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>4. Your content</h2>
          <p className={paragraphClass}>
            You retain ownership of content you provide, including portfolio
            projects, skills, experience, education, certificates, and resumes.
            You give OrixaAI permission to host, store, reproduce, process, and
            display that content only as reasonably needed to provide, secure,
            and improve the service for you. This includes displaying content on
            a public portfolio when you publish it.
          </p>
          <p className={paragraphClass}>
            You are responsible for having the rights and permissions needed for
            content you upload or publish, and for checking that it is accurate
            and appropriate to share.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>5. Acceptable use</h2>
          <p className={paragraphClass}>
            Do not use OrixaAI to violate the law or another person&apos;s
            rights, upload harmful or unauthorized material, interfere with or
            disrupt the service, bypass plan limits or security controls, or
            scrape the service in a way that burdens or abuses it. Do not use
            public portfolio contact forms to send spam, deceptive messages, or
            other unwanted communications. We may restrict activity that
            threatens users or the service.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>6. Plans, payments, and cancellation</h2>
          <p className={paragraphClass}>
            OrixaAI may offer free and Premium plans. Plan limits can include
            the number of portfolios, access to Premium themes, and whether an
            OrixaAI watermark appears. Paid subscriptions may be billed monthly
            or yearly as shown at checkout. Polar acts as our merchant of record
            and processes payments; OrixaAI does not store your full payment
            card number.You can manage or cancel your subscription using the
            billing controls provided by OrixaAI or the payment provider, as
            applicable. Cancellation stops future renewal and does not
            necessarily refund amounts already paid, except where required by
            law or stated at purchase. Do not misuse payment disputes or
            chargebacks; contact support first if a billing issue arises.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>7. Public portfolios</h2>
          <p className={paragraphClass}>
            Publishing makes the selected portfolio available to anyone with its
            public URL, generally in the form
            <span className="break-all"> /[username]/[slug]</span>. Public
            content may be viewed, copied, indexed, or shared by others. Do not
            publish information you want to keep private. Unpublishing or
            deleting content may not remove copies already made by visitors or
            search engines.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>8. AI and resume parsing</h2>
          <p className={paragraphClass}>
            AI-generated text and resume parsing are assistive features. They
            can be incomplete or incorrect. Review and edit all generated or
            parsed information before relying on it or publishing it. OrixaAI is
            not a law firm and does not provide legal advice, and using the
            service does not guarantee employment, clients, or other outcomes.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>9. Disclaimers</h2>
          <p className={paragraphClass}>
            To the extent permitted by law, OrixaAI is provided “as is” and “as
            available.” We do not promise uninterrupted or error-free operation,
            that every feature will always be available, or that portfolio
            content will produce any particular result. Any warranties that
            cannot legally be excluded remain unaffected.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>10. Limitation of liability</h2>
          <p className={paragraphClass}>
            To the extent permitted by law, OrixaAI will not be liable for
            indirect, incidental, special, consequential, exemplary, or punitive
            losses, or for lost profits, data, goodwill, or business
            opportunities. To the extent permitted by law, our total liability
            for claims relating to the service will not exceed the amounts you
            paid to OrixaAI in the 12 months before the event giving rise to the
            claim; if you paid nothing, the cap is USD 100. Nothing in these
            terms limits liability that cannot legally be limited.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>11. Suspension and termination</h2>
          <p className={paragraphClass}>
            You can stop using OrixaAI and request account deletion by
            contacting support. We may suspend or end access if you materially
            breach these terms, create a security or legal risk, or if we
            discontinue the service. Where reasonable, we will give notice and
            an opportunity to address the issue. Sections that by their nature
            should continue after termination will do so.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>12. Changes to these terms</h2>
          <p className={paragraphClass}>
            We may update these terms as the service changes or for legal,
            security, or operational reasons. We will update the date above when
            we do. If a change is material, we will take reasonable steps to
            give notice. Continued use after updated terms take effect means you
            accept them.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>13. Contact</h2>
          <p className={paragraphClass}>
            Questions about these terms? Contact{" "}
            <a
              className="text-primary hover:underline"
              href="mailto:support@orixaai.me"
            >
              support@orixaai.me
            </a>
            .
          </p>
        </section>

        <nav
          aria-label="Legal pages"
          className="border-t border-border pt-6 text-sm"
        >
          <Link href="/privacy" className="text-primary hover:underline">
            Read the Privacy Policy
          </Link>
        </nav>
      </article>
    </main>
  );
}
