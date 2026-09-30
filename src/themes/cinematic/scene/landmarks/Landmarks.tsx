"use client";

import { AboutTower } from "./AboutTower";
import { CertificatesBalloons } from "./CertificatesBalloons";
import { ContactLanding } from "./ContactLanding";
import { EducationPeaks } from "./EducationPeaks";
import { ExperienceBeacons } from "./ExperienceBeacons";
import { HeroRunway } from "./HeroRunway";
import { ProjectsGates } from "./ProjectsGates";
import { SkillsIslands } from "./SkillsIslands";
import { placementsOf } from "./placement";
import { useScene } from "../state/scene-context";

/**
 * Station -> 3D landmark. Sirf wahi stations render hote hain jo model me hain,
 * yaani data na ho to landmark bhi nahi banta.
 * Land ke children me rakho taake zameen ke saath ghoomein.
 */
export function Landmarks() {
  const { model, placements } = useScene();

  return (
    <>
      {model.stations.map((s) => {
        switch (s.id) {
          case "hero":         return <HeroRunway key={s.id} placement={placementsOf(placements, "hero")[0]} />;
          case "about":        return <AboutTower key={s.id} placement={placementsOf(placements, "about")[0]} />;
          case "skills":       return <SkillsIslands key={s.id} station={s} placements={placements} />;
          case "projects":     return <ProjectsGates key={s.id} station={s} placements={placements} />;
          case "experience":   return <ExperienceBeacons key={s.id} station={s} placements={placements} />;
          case "education":    return <EducationPeaks key={s.id} station={s} placements={placements} />;
          case "certificates": return <CertificatesBalloons key={s.id} station={s} placements={placements} />;
          case "contact":      return <ContactLanding key={s.id} placement={placementsOf(placements, "contact")[0]} />;
        }
      })}
    </>
  );
}