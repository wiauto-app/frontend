"use client";

import { useFormContext } from "react-hook-form";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Input } from "@/components/ui/input";
import { TractionsSelector } from "@/components/dynamicSelectors/tractionsSelector";
import { VehicleTransmissionTypeSelector } from "@/components/dynamicSelectors/vehicleTransmissionTypeSelector";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { Skeleton } from "@/components/ui/skeleton";
import { QuickVehicleElectricFields } from "./QuickVehicleElectricFields";
import { useVehicleSpecsAutofill } from "./hooks/useVehicleSpecsAutofill";

export const QuickVehicleTechnicalFields = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const { isLoadingVehicleSpecs } = useVehicleSpecsAutofill();

  if (isLoadingVehicleSpecs) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ControllerInput
          name="transmission_type"
          control={form.control}
          label="Transmisión"
        >
          {({ field }) => (
            <VehicleTransmissionTypeSelector
              value={field.value as string | undefined}
              onValueChange={field.onChange}
              disabled={field.disabled}
            />
          )}
        </ControllerInput>

        <ControllerInput
          name="traction_id"
          control={form.control}
          label="Tracción"
          optional
        >
          {({ field, fieldState }) => (
            <TractionsSelector
              value={field.value as string | undefined}
              onValueChange={field.onChange}
              ariaInvalid={fieldState.invalid}
              disabled={field.disabled}
            />
          )}
        </ControllerInput>
        <ControllerInput
          name="power"
          control={form.control}
          label="Potencia (CV)"
          optional
        >
          {({ field, fieldState }) => (
            <Input
              {...field}
              value={field.value == null ? "" : String(field.value)}
              type="number"
              inputMode="numeric"
              min={1}
              max={9999}
              aria-invalid={fieldState.invalid}
            />
          )}
        </ControllerInput>

        <ControllerInput
          name="displacement"
          control={form.control}
          label="Cilindrada (cc)"
          optional
        >
          {({ field, fieldState }) => (
            <Input
              {...field}
              value={field.value == null ? "" : String(field.value)}
              type="number"
              inputMode="numeric"
              min={0}
              max={20000}
              aria-invalid={fieldState.invalid}
            />
          )}
        </ControllerInput>
      </div>

      <QuickVehicleElectricFields />
    </div>
  );
};
