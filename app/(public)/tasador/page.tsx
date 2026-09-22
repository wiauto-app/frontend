import type { Metadata } from "next";

import { TasadorForm } from "./components/TasadorForm";
import { LandingHeader } from "@/components/ui/landingHeader";

export const metadata: Metadata = {
  title: "Tasador de vehículos | WiAuto",
  description:
    "Solicita una tasación gratuita de tu vehículo y recibe un rango de precio estimado de nuestro equipo.",
};

export default function TasadorPage() {
  return (
    <div className="flex flex-col gap-8">
      <LandingHeader title="Tasador de vehículos" />

      <div className="mx-auto w-full max-w-2xl">
        <TasadorForm variant="public" />
      </div>
    </div>
  );
}
