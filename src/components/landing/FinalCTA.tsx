import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="lp">
      <div className="lp-container">
        <div className="lp-cta">
          <h2>Ready to show your work the way it deserves?</h2>
          <p>Create your first portfolio free. No credit card required.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link href="/auth/signup" className="lp-btn lp-btn-primary">
              Build free portfolio
            </Link>
            <Link href="#pricing" className="lp-btn lp-btn-glass-hero">
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
