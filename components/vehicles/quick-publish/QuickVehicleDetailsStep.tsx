"use client";

import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { EquipmentForm } from "./equipmentForm";
import { QuickCatalogFuelBodyFields } from "./QuickCatalogFuelBodyFields";
import { QuickVehicleClassificationFields } from "./QuickVehicleClassificationFields";
import { QuickVehicleTechnicalFields } from "./QuickVehicleTechnicalFields";

/** Paso «Información extra» (profesionales): combustible, ficha, clasificación y equipamiento. */
export const QuickVehicleDetailsStep = () => {
  return (
    <div className="flex flex-col gap-10">
      <VehicleFormStep
        number={1}
        label="Combustible y carrocería"
        description="Se rellenan al elegir la versión; revísalos si hace falta."
      >
        <QuickCatalogFuelBodyFields />
      </VehicleFormStep>

      <QuickVehicleClassificationFields stepNumber={2} />

      <VehicleFormStep
        number={3}
        label="Ficha técnica"
        description="Se rellena automáticamente a partir de la versión. Revísala si quieres."
      >
        <QuickVehicleTechnicalFields />
      </VehicleFormStep>

      <VehicleFormStep number={4} label="Equipamiento">
        <EquipmentForm />
      </VehicleFormStep>
    </div>
  );
};
