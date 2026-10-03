import "@/components/landing/landing.css";

import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import DifferenceSection from "@/components/landing/DifferenceSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import GameRoot from "@/components/landing/game/GameRoot";

export default function HomePage() {
  return (
    <div className="relative overflow-x-clip bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <div id="how">
          <WorkflowSection />
        </div>
        <DifferenceSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
      <GameRoot />
    </div>
  );
}
