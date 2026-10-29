"use client";

import { useQuery } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";
import { Check } from "lucide-react";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { WiautoImage } from "@/components/ui/wiautoImage";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics/funnel";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { vehicleTypesService } from "@/components/vehicles/services/vehicleTypesService";

interface QuickVehicleTypeStepProps {
  stepNumber?: number;
}

export const QuickVehicleTypeStep = ({ stepNumber }: QuickVehicleTypeStepProps) => {
  const form = useFormContext<QuickVehicleSchema>();

  const { data: vehicleTypesPage, isLoading } = useQuery({
    queryKey: ["vehicle-types"],
    queryFn: () => vehicleTypesService.findAll({ page: 1, limit: 100 }),
  });

  const vehicleTypes = vehicleTypesPage?.data ?? [];

  return (
    <VehicleFormStep number={stepNumber} label="Tipo de vehículo">
      <Controller
        name="vehicle_type_id"
        control={form.control}
        render={({ field, fieldState }) => (
          <div data-field-name="vehicle_type_id">
            {isLoading ? (
              <p className="text-sm text-muted-foreground" role="status">
                Cargando tipos…
              </p>
            ) : (
              <div
                className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
                role="radiogroup"
                aria-label="Tipo de vehículo"
                aria-invalid={fieldState.invalid}
              >
                {vehicleTypes.map((vehicleType) => {
                  const isActive = field.value === vehicleType.id;

                  const handleSelectType = () => {
                    if (isActive) {
                      return;
                    }

                    field.onChange(vehicleType.id);
                    track("publicar_tipo", {
                      vehicle_type: vehicleType.name.toLowerCase(),
                    });
                  };

                  return (
                    <button
                      key={vehicleType.id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={handleSelectType}
                      className={cn(
                        "group flex items-center gap-2 rounded-xl border p-1.5 pr-3 text-left transition-colors",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border hover:border-primary/30 hover:bg-muted/50",
                      )}
                    >
                      {"image_url" in vehicleType && vehicleType.image_url ? (
                        <div
                          className={cn(
                            "relative size-10 shrink-0 overflow-hidden rounded-lg",
                            isActive
                              ? "bg-white/15"
                              : "bg-muted group-hover:bg-primary/5",
                          )}
                        >
                          <WiautoImage
                            unoptimized={false}
                            src={vehicleType.image_url}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      ) : null}

                      <span className="flex-1 truncate text-sm font-medium">
                        {vehicleType.name}
                      </span>
                      {isActive ? (
                        <Check className="size-4 shrink-0" aria-hidden />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
            {fieldState.error ? (
              <p className="mt-2 text-sm text-destructive">
                {fieldState.error.message}
              </p>
            ) : null}
          </div>
        )}
      />
    </VehicleFormStep>
  );
};
