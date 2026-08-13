"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Input } from "@/components/ui/input";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { useCanCharge } from "./hooks/useCanCharge";

export const QuickVehicleElectricFields = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const { canCharge } = useCanCharge();

  useEffect(() => {
    form.setValue("catalog_fuel_can_charge", canCharge, { shouldDirty: true });
    if (!canCharge) {
      form.setValue("autonomy", undefined, { shouldDirty: true });
      form.setValue("battery_capacity", undefined, { shouldDirty: true });
      form.setValue("time_to_charge", undefined, { shouldDirty: true });
    }
  }, [canCharge, form]);

  if (!canCharge) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Vehículo eléctrico o enchufable: completa los datos de autonomía y batería.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <ControllerInput name="autonomy" control={form.control} label="Autonomía (km)">
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
      <ControllerInput name="battery_capacity" control={form.control} label="Capacidad batería (kWh)">
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
      <ControllerInput name="time_to_charge" control={form.control} label="Tiempo de carga (h)">
        {({ field, fieldState }) => (
          <Input
            {...field}
            value={field.value == null ? "" : String(field.value)}
            type="number"
            min={0}
            step="0.1"
            aria-invalid={fieldState.invalid}
          />
        )}
      </ControllerInput>
      </div>
    </div>
  );
};
