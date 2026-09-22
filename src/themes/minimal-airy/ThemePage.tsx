import type { ThemePageProps } from "../types";
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
export function ThemePage({ config, profile, selection }: ThemePageProps) {
  const p = { config, profile };
  return (
    <>
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
    </>
  );
}
