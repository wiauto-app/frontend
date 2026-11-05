"use client";

import { useFormContext } from "react-hook-form";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { ControllerInput } from "@/components/ui/controllerInput";
import { FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { VEHICLE_CONDITION_OPTIONS } from "@/components/vehicles/constants/vehicle-enums.constants";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { useEntitlements } from "@/hooks/useEntitlements";
import { VehiclePriceRecommendation } from "./VehiclePriceRecommendation";
import { requestPublishDatosCheck } from "./QuickVehiclePublishDataTracker";

interface QuickVehiclePricingFieldsProps {
  stepNumber?: number;
}

export const QuickVehiclePricingFields = ({
  stepNumber,
}: QuickVehiclePricingFieldsProps) => {
  const form = useFormContext<QuickVehicleSchema>();
  const { isSubscribed } = useEntitlements();

  return (
    <VehicleFormStep number={stepNumber} label="Precio">
      <div className="flex flex-col gap-4">
        {isSubscribed ? (
          <ControllerInput
            name="condition"
            label="Estado"
            control={form.control}
          >
            {({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
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

                {fieldState.error ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </div>
            )}
          </ControllerInput>
        ) : null}

        <div className="rounded-lg bg-primary/10 p-4">
          <VehiclePriceRecommendation
            onPriceBlur={requestPublishDatosCheck}
          />
        </div>
      </div>
    </VehicleFormStep>
  );
};
