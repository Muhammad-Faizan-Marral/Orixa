import type { PortfolioRenderConfig } from "../../types";
import { ContactForm } from "./ContactForm";
import { ContactSimple } from "./ContactSimple";
import { ContactSplit } from "./ContactSplit";
import { ContactMagnetic } from "./ContactMagnetic";
import { ContactSplitMotion } from "./ContactSplitMotion";
import { ContactGlass } from "./ContactGlass";

export function ContactSection({
  variant,
  config,
}: {
  variant?: string;
  config: PortfolioRenderConfig;
}) {
  switch (variant) {
    case "form":
      return <ContactForm config={config} />;
    case "split":
      return <ContactSplit config={config} />;
    case "magnetic":
      return <ContactMagnetic config={config} />;
    case "split-motion":
      return <ContactSplitMotion config={config} />;
    case "glass":
      return <ContactGlass config={config} />;
    case "simple":
    default:
      return <ContactSimple config={config} />;
  }
}