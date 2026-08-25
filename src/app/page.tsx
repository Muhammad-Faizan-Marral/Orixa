import { SiteNavbar } from "@/components/marketing/site-navbar";
import { Hero } from "@/components/marketing/hero";
import { ProblemSolution } from "@/components/marketing/problem-solution";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { AiShowcase } from "@/components/marketing/ai-showcase";
import { Workflow } from "@/components/marketing/workflow";
import { Showcase } from "@/components/marketing/showcase";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <Hero />
        <ProblemSolution />
        <FeatureGrid />
        <AiShowcase />
        <Workflow />
        <Showcase />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
