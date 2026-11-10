"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CountUp from "./CountUp";

const TRUST = ["Free to start", "No credit card", "No design or coding skills"];

const Arrow = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function HeroSection() {
  const hero = useRef<HTMLElement>(null);
  const [past, setPast] = useState(false);

  // Sticky mobile CTA appears once the hero is scrolled past
  useEffect(() => {
    const el = hero.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <section ref={hero} aria-labelledby="hero-heading" className="lp lp-hero">
        <div className="lp-hero-frame">
          <div className="lp-hero-scrim">
            <div className="lp-hero-content">
              <h1 id="hero-heading" className="lp-hero-title">
                Build a portfolio
                <span className="lp-sub">that gets you noticed.</span>
              </h1>

              <p className="lp-hero-text">
                Turn your resume into a polished professional portfolio with Orixa AI. Choose your
                design, showcase your work, and share your website in minutes.
              </p>

              <div className="lp-hero-ctas">
                <Link href="/auth/signup" className="lp-btn lp-btn-primary">
                  <span>Create my portfolio</span>
                  <span className="lp-btn-icon"><Arrow /></span>
                </Link>
                <Link href="#pillars" className="lp-btn lp-btn-glass-hero">
                  See how it works
                </Link>
              </div>

              {/* Floating UI cards */}
              <div className="lp-strip" aria-hidden="true">
                <div className="lp-strip-row">
                  <div className="lp-float lp-float-1">
                    <Image
                      src="/lp/tpl-glass.webp"
                      alt=""
                      width={32}
                      height={32}
                      sizes="32px"
                      className="lp-avatar"
                    />
                    <div>
                      <b>Ayesha Khan</b>
                      <small>Product Designer</small>
                    </div>
                  </div>

                  <div className="lp-float lp-float-2">
                    <div>
                      <small style={{ fontWeight: 600 }}>VISITORS</small>
                      <b style={{ fontSize: 15, fontWeight: 700 }}><CountUp to={2847} /></b>
                    </div>
                    <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                      <path d="M2 20 Q 15 18, 25 10 T 45 12 T 58 4" stroke="#1E6BFF" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>

                  <div className="lp-float lp-float-3">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1E6BFF" }} />
                    <div>
                      <b>Messages</b>
                      <small><CountUp to={31} /> new inquiries</small>
                    </div>
                  </div>

                  <div className="lp-float lp-float-4">
                    <svg width="14" height="14" fill="none" stroke="#10B981" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <div>
                      <b>ayeshakhan.com</b>
                      <small style={{ color: "#10B981", fontWeight: 600 }}>● SSL Active</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lp-trust">
                {TRUST.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={`lp-sticky-cta ${past ? "is-visible" : ""}`} aria-hidden={!past}>
        <Link href="/auth/signup" className="lp-btn lp-btn-primary" tabIndex={past ? 0 : -1}>
          Create my portfolio — free
        </Link>
      </div>
    </>
  );
}
