import { Metadata } from "next";

import { LandingContainer } from "@/components/ui/landingContainer";
import { AboutHeroSection } from "./components/AboutHeroSection";
import { AboutMissionSection } from "./components/AboutMissionSection";
import { AboutTeamSection } from "./components/AboutTeamSection";
import { AboutValuesSection } from "./components/AboutValuesSection";
import { aboutUsService } from "./services/aboutUsService";

export const metadata: Metadata = {
  title: "Sobre nosotros | Wiauto",
  description: "Sobre nosotros | Wiauto",
};

export default async function SobreNosotrosPage() {
  const data = await aboutUsService.findAll();

  if (!data) {
    return null;
  }

  return (
    <>
      <LandingContainer>
        <AboutHeroSection hero={data.hero} />
        <AboutMissionSection mission={data.mission} />
      </LandingContainer>

      <AboutValuesSection data={data.caracteristicas} />

      <LandingContainer>
        <AboutTeamSection personas={data.personas} />
      </LandingContainer>
    </>
  );
}
