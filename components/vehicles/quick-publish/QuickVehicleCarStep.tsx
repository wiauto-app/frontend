"use client";

import { useFormContext } from "react-hook-form";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { QuickCatalogFields } from "./QuickCatalogFields";
import { QuickVehicleIdentificationFields } from "./QuickVehicleIdentificationFields";
import { QuickVehiclePricingFields } from "./QuickVehiclePricingFields";
import { QuickVehiclePublishDataTracker } from "./QuickVehiclePublishDataTracker";
import { QuickVehicleTypeStep } from "./QuickVehicleTypeStep";

/** Pantalla «Coche»: tipo, matrícula/VIN, marca-modelo-versión-año, km y precio. */
export const QuickVehicleCarStep = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const versionError = form.formState.errors.version_id;

  return (
    <div className="flex flex-col gap-10">
      <QuickVehiclePublishDataTracker />
      <QuickVehicleTypeStep stepNumber={1} />
      <QuickVehicleIdentificationFields stepNumber={2} />

      <VehicleFormStep number={3} label="¿Qué vehículo vendes?">
        <div data-field-name="version_id">
          <QuickCatalogFields />
        </div>
        {versionError ? (
          <p className="text-sm text-destructive">{versionError.message}</p>
        ) : null}
      </VehicleFormStep>

      <QuickVehiclePricingFields stepNumber={4} />
    </div>
  );
};
