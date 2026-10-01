import type { ThemePageProps } from "../types";
import { buildCinematicModel } from "./data";
import { CinematicScene } from "./scene";
import { tokens } from "./tokens";
import { Styles } from "./sections/shared/Styles";
import { Navbar } from "./sections/navbar";
import { Hero } from "./sections/hero";
import { About } from "./sections/about";
import { Skills } from "./sections/skills";
import { Projects } from "./sections/projects";
import { Experience } from "./sections/experience";
import { Education } from "./sections/education";
import { Certificates } from "./sections/certificates";
import { Contact } from "./sections/contact";
import { Footer } from "./sections/footer";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap";

export function ThemePage({ config, profile, selection }: ThemePageProps) {
  // Model ek baar banta hai; scene aur sab sections isi ko read karte hain.
  const model = buildCinematicModel({ config, profile });
  const p = { config, profile, model };

  return (
    <div className="cin-root" style={{ background: tokens.backgroundColor, color: tokens.foregroundColor }}>
      <link rel="stylesheet" href={FONTS} precedence="default" />
      <Styles />

      {/* fixed 3D canvas (z-0) */}
      <CinematicScene model={model} />

      {/* scroll height = flight length. Sections fixed panels hain, ye spacer scroll deta hai */}
      <div aria-hidden style={{ height: `${model.journey.scrollPages * 100}vh` }} />

      <Navbar {...p} variant={selection.navbar} />
      <Hero {...p} variant={selection.hero} />
      <About {...p} variant={selection.about} />
      <Skills {...p} variant={selection.skills} />
      <Projects {...p} variant={selection.projects} />
      <Experience {...p} variant={selection.experience} />
      <Education {...p} variant={selection.education} />
      <Certificates {...p} variant={selection.certificates} />
      <Contact {...p} variant={selection.contact} />
      <Footer {...p} variant={selection.footer} />
    </div>
  );
}
