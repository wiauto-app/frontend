"use client";

import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { QuickVehicleAiDescriptionCard } from "./QuickVehicleAiDescriptionCard";

interface QuickVehicleDescriptionStepProps {
  stepNumber?: number;
}

/** Descripción del anuncio: al final del wizard, con el máximo contexto para la IA. */
export const QuickVehicleDescriptionStep = ({
  stepNumber,
}: QuickVehicleDescriptionStepProps) => {
  return (
    <VehicleFormStep
      number={stepNumber}
      isOptional
      label="Descripción del vehículo"
      description="Describe el estado, historial y puntos destacados. Cuantos más datos hayas rellenado, mejor será la descripción generada."
    >
      <div
        className="flex flex-col gap-4 rounded-lg bg-primary/10 p-4"
        data-field-name="description"
      >
        <QuickVehicleAiDescriptionCard />
      </div>
    </VehicleFormStep>
  );
};
