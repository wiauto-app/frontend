import type { Metadata } from "next";

import { LandingContainer } from "@/components/ui/landingContainer";

import { CheckCarCard } from "./components/CheckCarCard";
import { HistoryCards } from "./components/HistoryCards";
import { HowItsWork } from "./components/HowItsWork";
import { PlateSearch } from "./components/PlateSearch";
import { VehicleHero } from "./components/VehicleHero";

export const metadata: Metadata = {
  title: "Informe historial vehículo | WiAuto",
  description:
    "Consulta el historial completo de cualquier vehículo en segundos. Propietarios, kilometraje, accidentes, situación administrativa e inspecciones.",
};

export default function InformeHistorialVehiculo() {
  return (
    <>
      <PlateSearch />
      <LandingContainer className="py-8 md:py-12">
        <HistoryCards />
        <VehicleHero />
        <HowItsWork />
        <CheckCarCard />
      </LandingContainer>
    </>
  );
}
