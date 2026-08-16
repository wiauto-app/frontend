"use client";

import { useFormContext } from "react-hook-form";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { ControllerInput } from "@/components/ui/controllerInput";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { VEHICLE_CONDITION_OPTIONS } from "@/components/vehicles/constants/vehicle-enums.constants";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { VehiclePriceRecommendation } from "./VehiclePriceRecommendation";

export const QuickVehiclePricingFields = () => {
  const form = useFormContext<QuickVehicleSchema>();
  return (
    <VehicleFormStep number={3} label="Estado, kilometraje y precio">
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ControllerInput
            name="condition"
            label="Estado"
            control={form.control}
          >
            {({ field, fieldState }) => (
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

                {fieldState.error ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </div>
            )}
          </ControllerInput>
          <ControllerInput
            name="mileage"
            control={form.control}
            label="Kilometraje"
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
          <ControllerInput
            name="price"
            control={form.control}
            label="Precio (€)"
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
         
        </div>
        <VehiclePriceRecommendation />
      </div>
    </VehicleFormStep>
  );
};
