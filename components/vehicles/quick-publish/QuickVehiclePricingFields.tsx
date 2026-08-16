"use client";

import { Controller, useFormContext } from "react-hook-form";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { VEHICLE_CONDITION_OPTIONS } from "@/components/vehicles/constants/vehicle-enums.constants";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { VehiclePriceRecommendation } from "./VehiclePriceRecommendation";
import { useEntitlements } from "@/hooks/useEntitlements";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

export const QuickVehiclePricingFields = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const { isSubscribed } = useEntitlements();
  return (
    <VehicleFormStep number={3} label="Estado, kilometraje y precio">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          {isSubscribed ? (
            <ControllerInput
              name="finance_price"
              control={form.control}
              label="Precio de financiación (€)"
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
          ) : null}
          <ControllerInput
            name="show_first_cuota"
            control={form.control}
            label="Mostrar primera cuota"
            orientation="horizontal"
          >
            {({ field, fieldState }) => (
              <Switch
                checked={field.value as boolean}
                onCheckedChange={(checked) => field.onChange(checked as boolean)}
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
