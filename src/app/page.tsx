import "@/components/landing/landing.css";

import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import PillarsSection from "@/components/landing/PillarsSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import DifferenceSection from "@/components/landing/DifferenceSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import GameRoot from "@/components/landing/game/GameRoot";
import DesignLabSection from "@/components/landing/Designlabsection";
import { CookieNotice } from "@/components/legal/legal-notices";

export default function HomePage() {
  return (
    <div className="relative overflow-x-clip bg-background text-foreground" style={{ ["--font-display" as string]: "var(--font-dm), sans-serif" }}>
      <Navbar />
      <main>
        <HeroSection />
        <PillarsSection />
        <div id="how">
          <WorkflowSection />
        </div>
        <DifferenceSection />
        <div id="features">
          <FeaturesSection />
          <div id="samplework"><DesignLabSection /></div>
        </div>
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
      <GameRoot />
      <CookieNotice />
    </div>
  );
}