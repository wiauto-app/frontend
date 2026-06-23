"use client";

import { Controller, useFormContext } from "react-hook-form";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { VEHICLE_CONDITION_OPTIONS } from "@/components/vehicles/constants/vehicle-enums.constants";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";

export const QuickVehiclePricingFields = () => {
  const form = useFormContext<QuickVehicleSchema>();

  return (
    <section className="flex flex-col gap-4">
      <VehicleFormStep number={3} label="Estado, kilometraje y precio" isRequired />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Controller
          name="condition"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Estado</FieldLabel>
              <div className="flex gap-2">
                {VEHICLE_CONDITION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(option.value)}
                    className={cn(
                      "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                      field.value === option.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-muted",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />
        <ControllerInput name="mileage" control={form.control} label="Kilometraje">
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
        <ControllerInput name="price" control={form.control} label="Precio (€)">
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
      </div>
    </section>
  );
};
