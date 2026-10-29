"use client";

import { useFormContext } from "react-hook-form";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Textarea } from "@/components/ui/textarea";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { EquipmentForm } from "./equipmentForm";
import { GeneratedDescriptionConfig } from "./generatedDescription/generatedDescriptionConfig";
import { QuickVehicleAiDescriptionCard } from "./QuickVehicleAiDescriptionCard";
import { QuickVehicleClassificationFields } from "./QuickVehicleClassificationFields";
import { QuickVehicleTechnicalFields } from "./QuickVehicleTechnicalFields";

/** «Mejora tu anuncio»: lo que no se pide al publicar y se completa al editar. */
export const QuickVehicleDetailsStep = () => {
  const form = useFormContext<QuickVehicleSchema>();

  return (
    <div className="flex flex-col gap-10">
      <QuickVehicleClassificationFields stepNumber={1} />

      <VehicleFormStep
        number={2}
        label="Ficha técnica"
        description="Se rellena automáticamente a partir de la versión. Revísala si quieres."
      >
        <QuickVehicleTechnicalFields />
      </VehicleFormStep>

      <VehicleFormStep number={3} label="Equipamiento">
        <EquipmentForm />
      </VehicleFormStep>

      <VehicleFormStep
        number={4}
        isOptional
        label="Descripción del vehículo"
        description="Describe el estado, historial y puntos destacados del vehículo."
      >
        <div className="flex flex-col gap-4">
          <QuickVehicleAiDescriptionCard />
          <GeneratedDescriptionConfig />

          <ControllerInput
            name="description"
            control={form.control}
            label="Descripción"
          >
            {({ field, fieldState }) => (
              <Textarea
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                id="quick-description"
                className="h-28 md:h-56 resize-none whitespace-pre-wrap"
                aria-invalid={fieldState.invalid}
              />
            )}
          </ControllerInput>
        </div>
      </VehicleFormStep>
    </div>
  );
};
