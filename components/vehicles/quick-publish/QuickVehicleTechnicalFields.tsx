"use client";

import { useFormContext } from "react-hook-form";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Input } from "@/components/ui/input";
import { TractionsSelector } from "@/components/dynamicSelectors/tractionsSelector";
import { VehicleTransmissionTypeSelector } from "@/components/dynamicSelectors/vehicleTransmissionTypeSelector";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { QuickVehicleElectricFields } from "./QuickVehicleElectricFields";
import { useCanCharge } from "./hooks/useCanCharge";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { catalogVersionsService } from "../services/catalogVersionsService";
import { Skeleton } from "@/components/ui/skeleton";

export const QuickVehicleTechnicalFields = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const versionId = form.watch("version_id");
  const { canCharge } = useCanCharge();

  useEffect(() => {
    if (canCharge) {
      form.setValue("power", 0, { shouldDirty: true });
      form.setValue("displacement", 0, { shouldDirty: true });
    }
  }, [canCharge, form]);

  const { data: vehicleSpecs, isLoading: isLoadingVehicleSpecs } = useQuery({
    queryKey: ["vehicleSpecs", versionId],
    queryFn: () => catalogVersionsService.getVehicleSpecs(versionId),
    enabled: Boolean(versionId),
  });

  useEffect(() => {
    if (vehicleSpecs) {
      form.setValue("power", vehicleSpecs.power, { shouldDirty: true });
      form.setValue("displacement", vehicleSpecs.displacement, {
        shouldDirty: true,
      });
      form.setValue(
        "transmission_type",
        vehicleSpecs.transmission as "manual" | "automatic",
        { shouldDirty: true },
      );
      form.setValue("traction_id", vehicleSpecs.traction_id.toString(), {
        shouldDirty: true,
      });
      form.setValue("autonomy", vehicleSpecs.autonomy, { shouldDirty: true });
      form.setValue("battery_capacity", vehicleSpecs.battery_capacity, {
        shouldDirty: true,
      });
      form.setValue("time_to_charge", vehicleSpecs.time_to_charge, {
        shouldDirty: true,
      });
    }
  }, [vehicleSpecs, form]);

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
        <>
          <ControllerInput
            name="power"
            control={form.control}
            label="Potencia (CV o kW)"
          >
            {({ field, fieldState }) => (
              <Input
                {...field}
                value={field.value == null ? "" : String(field.value)}
                type="number"
                min={1}
                aria-invalid={fieldState.invalid}
              />
            )}
          </ControllerInput>

          <ControllerInput
            name="displacement"
            control={form.control}
            label="Cilindrada (cc)"
          >
            {({ field, fieldState }) => (
              <Input
                {...field}
                value={field.value == null ? "" : String(field.value)}
                type="number"
                min={0}
                aria-invalid={fieldState.invalid}
              />
            )}
          </ControllerInput>
        </>
      </div>

      <QuickVehicleElectricFields />
    </div>
  );
};
