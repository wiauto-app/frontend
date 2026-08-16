"use client";

import { useQuery } from "@tanstack/react-query";
import { featuresService } from "../services/featuresService";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field";
import { QuickVehicleSchema } from "../schemas/quick-vehicle.schema";
import { toggleCatalogIdInList } from "../utils/toggleCatalogIdInList";
import { Check, Plus } from "lucide-react";

export const EquipmentForm = () => {
  const form = useFormContext<QuickVehicleSchema>();

  const { data: features } = useQuery({
    queryKey: ["features"],
    queryFn: () => featuresService.findAll({ page: 1, limit: 100 }),
  });

  return (
    <Controller
      name="features_ids"
      control={form.control}
      render={({ field, fieldState }) => {
        const ids = field.value ?? [];

        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Equipamiento
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Selecciona el equipamiento que incluye el vehículo
                </p>
              </div>

              {ids.length > 0 && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {ids.length} seleccionado{ids.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {features?.data.map((feature) => {
                const checkboxId = `quick-feature-${feature.id}`;
                const checked = ids.includes(feature.id);

                return (
                  <label
                    key={feature.id}
                    htmlFor={checkboxId}
                    className={`
                      group flex cursor-pointer items-center justify-between
                      rounded-xl border px-4 py-3
                      transition-all duration-150
                      ${
                        checked
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
                      }
                    `}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Indicador visual */}
                      <div
                        className={`
                          flex size-8 shrink-0 items-center justify-center
                          rounded-lg text-xs font-semibold
                          transition-colors
                          ${
                            checked
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                          }
                        `}
                      >
                        {checked ? (
                          <Check className="size-4" />
                        ) : (
                          <Plus className="size-4" />
                        )}
                      </div>

                      <span
                        className={`
                          truncate text-sm font-medium
                          ${
                            checked
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        `}
                      >
                        {feature.name}
                      </span>
                    </div>

                    <Checkbox
                      hidden
                      id={checkboxId}
                      checked={checked}
                      onCheckedChange={(value) => {
                        field.onChange(
                          toggleCatalogIdInList(
                            ids,
                            feature.id,
                            value === true,
                          ),
                        );
                      }}
                      className="ml-3 shrink-0"
                    />
                  </label>
                );
              })}
            </div>

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </div>
        );
      }}
    />
  );
};
