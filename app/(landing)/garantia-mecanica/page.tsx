import type { Metadata } from "next";

import { LandingContainer } from "@/components/ui/landingContainer";
import { NOINDEX_ROBOTS } from "@/lib/seo/noindex";

import { CalculationHero } from "./components/CalculationHero";
import { CarPartsGrid } from "./components/CarPartsGrid";
import { GuaranteeBenefits } from "./components/GuaranteeBenefits";
import { GuaranteeCtaCard } from "./components/GuaranteeCtaCard";
import { SectionContainer } from "@/components/home";

export const metadata: Metadata = {
  title: "Garantía Mecánica | WiAuto",
  description:
    "Conduce tranquilo con la garantía mecánica WiAuto. Cobertura frente a averías mecánicas, eléctricas y electrónicas.",
  robots: NOINDEX_ROBOTS,
};

export default function GarantiaMecanicaPage() {
  return (
    <LandingContainer>
      <CalculationHero />
      <CarPartsGrid />
      <GuaranteeBenefits />
      <GuaranteeCtaCard />
    </LandingContainer>
  );
}
