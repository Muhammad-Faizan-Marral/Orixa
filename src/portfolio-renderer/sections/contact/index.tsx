import type { PortfolioRenderConfig } from "../../types";
import { ContactForm } from "./ContactForm";
import { ContactSimple } from "./ContactSimple";
import { ContactSplit } from "./ContactSplit";

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

    case "simple":
    default:
      return <ContactSimple config={config} />;
  }
}