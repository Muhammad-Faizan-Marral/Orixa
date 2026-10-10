import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How OrixaAI collects, uses, and protects information.",
};

const sectionClass = "space-y-3";
const headingClass = "text-xl font-semibold tracking-tight text-foreground";
const paragraphClass = "leading-7 text-muted-foreground";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground sm:py-16">
      <article className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3">
          <Link href="/" className="text-sm text-primary hover:underline">
            OrixaAI
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: October 7, 2026</p>
          <p className={paragraphClass}>
            This policy describes how OrixaAI (“we”) handles information when
            you use orixaai.me, create a portfolio, or visit a published
            portfolio. It should be read with our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </header>

        <section className={sectionClass}>
          <h2 className={headingClass}>1. Who we are and scope</h2>
          <p className={paragraphClass}>
            OrixaAI provides an AI-assisted portfolio builder, public portfolio
            hosting, Design Lab, and owner-facing portfolio analytics. This
            policy covers information processed through those services,
            including account and visitor information described below.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>2. Information we collect</h2>
          <ul className="list-disc space-y-3 pl-6 leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">Account information:</strong>{" "}
              email address, authentication identifiers from Supabase or an
              OAuth provider, and profile details such as your name and
              username.
            </li>
            <li>
              <strong className="text-foreground">Portfolio content:</strong>{" "}
              projects, skills, experience, education, certificates, design
              choices, and other details you add. If you choose to upload a
              resume for onboarding or parsing, we process the file and
              extracted information to provide that feature.
            </li>
            <li>
              <strong className="text-foreground">Usage and portfolio
              analytics:</strong> interactions with the service and, for
              published portfolios, visitor views and actions such as project
              or contact clicks. Owner-facing reports may include country or
              coarse location, referrer, and device information.
            </li>
            <li>
              <strong className="text-foreground">Contact messages:</strong>{" "}
              information and message content that visitors submit through a
              public portfolio contact form, including information needed to
              deliver the message to the portfolio owner.
            </li>
            <li>
              <strong className="text-foreground">Payment metadata:</strong>{" "}
              subscription status, plan, and transaction-related details made
              available through Polar. Polar processes payment card details;
              OrixaAI does not store full card numbers.
            </li>
            <li>
              <strong className="text-foreground">Technical and referral
              information:</strong> basic device, request, performance, and
              security information may be processed by our hosting and
              performance tools. If you arrive through a referral link, we may
              store the referral code in browser storage or a cookie for
              attribution.
            </li>
          </ul>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>3. How we use information</h2>
          <p className={paragraphClass}>
            We use information to create and secure accounts; build, edit, and
            host portfolios; process optional resume uploads; provide Design
            Lab and AI-assisted features; show portfolio analytics to the
            portfolio owner; deliver contact messages by email; manage plans
            and billing; prevent abuse; provide support; and maintain, secure,
            and improve the service. We do not use resume parsing as a
            substitute for your review of portfolio content.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>4. Reasons for processing</h2>
          <p className={paragraphClass}>
            In plain terms, we process information when it is needed to provide
            a service you requested or perform our agreement with you. We may
            also process limited information for legitimate operational
            interests such as keeping OrixaAI secure, preventing abuse,
            supporting users, and understanding service reliability, while
            considering the impact on users. Where applicable, we may process
            information to meet legal obligations or with your permission.
            Which basis applies can depend on the circumstances and the law
            where you are.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>5. Service providers and sharing</h2>
          <p className={paragraphClass}>
            We share information with service providers only as needed to
            operate OrixaAI: Supabase for authentication, database, and
            storage; Vercel for hosting and performance or usage measurement;
            Resend for email delivery; and Polar for subscription payments.
            These providers process information under their own terms and
            privacy practices and our arrangements with them. We may also
            disclose information when needed to protect users or the service,
            respond to valid legal process, or handle a business transfer.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>6. Public portfolio information</h2>
          <p className={paragraphClass}>
            When you publish a portfolio, its published content and public URL
            are available to visitors. Visitors may share or copy that
            information, and search engines may index it. Portfolio analytics
            are provided to the portfolio owner; they can include broad
            visitor attributes such as country, referrer, or device, not a
            promise of personally identifying each visitor. Keep private
            information out of content you publish.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>7. Cookies and local storage</h2>
          <p className={paragraphClass}>
            OrixaAI and its providers may use cookies or similar browser
            storage for authentication sessions, security, preferences such as
            theme or language, referral attribution where applicable, and
            remembering whether you dismissed a privacy or legal notice.
            Vercel Analytics and Speed Insights are also present in the
            application to measure site usage and performance. You can manage
            browser storage through your browser settings, but blocking
            essential storage may affect sign-in or service features.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>8. Retention</h2>
          <p className={paragraphClass}>
            We generally keep account and portfolio information while your
            account is active and as needed to provide the service. If you
            request deletion, we will take reasonable steps to delete or
            de-identify account information, subject to information we must
            retain for legitimate operational, security, dispute, or legal
            reasons. Backups and technical logs may remain for a reasonable
            period before routine deletion.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>9. Security</h2>
          <p className={paragraphClass}>
            We use reasonable technical and organizational measures intended
            to protect information. No online service or transmission can be
            guaranteed completely secure, so please use a strong password and
            let us know if you believe your account has been compromised.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>10. Your choices and rights</h2>
          <p className={paragraphClass}>
            You can review and update some profile and portfolio information
            through your account. You may also request access to, correction
            of, or deletion of your personal information by contacting{" "}
            <a className="text-primary hover:underline" href="mailto:contact@orixaai.me">
              contact@orixaai.me
            </a>
            . We will consider and respond to requests as required by the laws
            that apply. You can also control cookies and local storage in your
            browser, though some service features may then stop working.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>11. Children</h2>
          <p className={paragraphClass}>
            OrixaAI is not directed to children under 13, and we do not
            knowingly seek to collect their personal information. If you
            believe a child has provided information to us, contact support so
            we can review and take appropriate steps. A parent or guardian
            should supervise any use by a minor who is permitted to use the
            service under applicable law.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>12. International processing</h2>
          <p className={paragraphClass}>
            OrixaAI and its service providers may process or store information
            in countries other than the one where you live. Privacy protections
            and rules in those countries may differ. We use service providers
            to operate the product and take reasonable steps intended to
            protect information when it is processed internationally.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>13. Changes and contact</h2>
          <p className={paragraphClass}>
            We may update this policy as OrixaAI changes or for legal,
            security, or operational reasons. We will revise the date above
            when we do and take reasonable steps to notify you of material
            changes. Questions or privacy requests can be sent to{" "}
            <a className="text-primary hover:underline" href="mailto:contact@orixaai.me">
              contact@orixaai.me
            </a>
            .
          </p>
        </section>

        <nav aria-label="Legal pages" className="border-t border-border pt-6 text-sm">
          <Link href="/terms" className="text-primary hover:underline">
            Read the Terms of Service
          </Link>
        </nav>
      </article>
    </main>
  );
}
