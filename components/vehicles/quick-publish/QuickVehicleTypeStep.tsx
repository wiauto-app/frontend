"use client";

import { useQuery } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";
import { Check } from "lucide-react";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { WiautoImage } from "@/components/ui/wiautoImage";
import { cn } from "@/lib/utils";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { vehicleTypesService } from "@/components/vehicles/services/vehicleTypesService";

export const QuickVehicleTypeStep = () => {
  const form = useFormContext<QuickVehicleSchema>();

  const { data: vehicleTypesPage, isLoading } = useQuery({
    queryKey: ["vehicle-types"],
    queryFn: () => vehicleTypesService.findAll({ page: 1, limit: 100 }),
  });

  const vehicleTypes = vehicleTypesPage?.data ?? [];

  return (
    <section className="flex flex-col gap-4">
      <VehicleFormStep
        number={1}
        label="Tipo de vehículo"
        description="Selecciona la categoría que mejor describe tu anuncio."
      />
      <Controller
        name="vehicle_type_id"
        control={form.control}
        render={({ field, fieldState }) => (
          <div>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Cargando tipos…</p>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-y-auto">
                {vehicleTypes.map((vehicleType) => {
                  const active = field.value === vehicleType.id;

                  return (
                    <button
                      key={vehicleType.id}
                      type="button"
                      onClick={() =>
                        field.onChange(active ? "" : vehicleType.id)
                      }
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-xl border text-left transition-all",
                        active
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border hover:border-primary/30 hover:bg-muted/50",
                      )}
                    >
                      {"image_url" in vehicleType && vehicleType.image_url ? (
                        <div
                          className={cn(
                            "relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg",
                            active
                              ? "bg-white/15"
                              : "bg-muted group-hover:bg-primary/5",
                          )}
                        >
                          <WiautoImage
                            unoptimized={false}
                            src={vehicleType.image_url}
                            alt={vehicleType.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      ) : null}

                      <div className="flex flex-1 items-center justify-between px-3 py-2.5">
                        <p className="text-sm font-medium">
                          {vehicleType.name}
                        </p>
                        {active ? <Check className="h-4 w-4 shrink-0" /> : null}
                      </div>
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
    </section>
  );
};
