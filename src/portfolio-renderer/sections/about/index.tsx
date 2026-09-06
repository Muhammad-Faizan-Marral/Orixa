import React from "react";

// Existing variant
import { AboutSplit } from "./AboutSplit";

// New premium variants
import { EditorialAbout } from "./EditorialAbout";
import { StoryAbout } from "./StoryAbout";
import { PortraitAbout } from "./PortraitAbout";
import { AboutCards } from "./AboutCards";
import { AboutDefault } from "./AboutDefault";

type AboutConfig = {
  name?: string | null;
  about?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  location?: string | null;
};

type AboutSectionProps = {
  config: AboutConfig;
  variant?: string;
};

export const AboutSection: React.FC<AboutSectionProps> = ({
  config,
  variant = "default",
}) => {
  switch (variant) {
    case "cards":
      return <AboutCards config={config} />;
    case "split":
      return <AboutSplit config={config} />;
    case "editorial":
      return <EditorialAbout config={config} />;
    case "story":
      return <StoryAbout config={config} />;
    case "portrait":
      return <PortraitAbout config={config} />;
    case "default":
    default:
      return <AboutDefault config={config} />;
  }
};

export default AboutSection;
