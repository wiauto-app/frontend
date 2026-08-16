"use client";

import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { useQuery } from "@tanstack/react-query";
import { cuotasService } from "../services/cuotasService";
import { Controller } from "react-hook-form";
import { FieldError } from "@/components/ui/field";
import { useFormContext } from "react-hook-form";
import { QuickVehicleSchema } from "../schemas/quick-vehicle.schema";
import { ControllerInput } from "@/components/ui/controllerInput";
import { WarrantyTypesSelector } from "@/components/dynamicSelectors/warrantyTypesSelector";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const toggleCuotaIdInList = (
  current_ids: string[],
  cuota_id: string,
): string[] => {
  if (current_ids.includes(cuota_id)) {
    return current_ids.filter((id) => id !== cuota_id);
  }

  return [...current_ids, cuota_id];
};

export const FinanceWarrantyForm = () => {
  const form = useFormContext<QuickVehicleSchema>();

  const { data: cuotas_page } = useQuery({
    queryKey: ["cuotas", "all-plans"],
    queryFn: () => cuotasService.findAll({ page: 1, limit: 100 }),
  });

  const cuotas = cuotas_page?.data ?? [];

  return (
    <VehicleFormStep number={1} label="Financiación y garantía">
      <div className="space-y-7">
        {/* Financiación */}
        <div className="space-y-3">
          <Controller
            name="cuota_ids"
            control={form.control}
            render={({ field, fieldState }) => {
              const ids = Array.isArray(field.value) ? field.value : [];

              return (
                <div className="space-y-2">
                  {cuotas.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {cuotas.map((cuota) => {
                        const selected = ids.includes(cuota.id);

                        return (
                          <button
                            key={cuota.id}
                            type="button"
                            onClick={() =>
                              field.onChange(toggleCuotaIdInList(ids, cuota.id))
                            }
                            className={cn(
                              "group relative flex  w-full items-center justify-between rounded-xl border px-4 py-2 text-left transition-all",
                              "hover:border-primary/50 hover:bg-muted/40",
                              selected
                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                : "border-border bg-background",
                            )}
                            aria-pressed={selected}
                          >
                            <div className="min-w-0">
                              <p
                                className={cn(
                                  "font-medium",
                                  selected ? "text-primary" : "text-foreground",
                                )}
                              >
                                {cuota.name}
                              </p>

                              {/* <p className="mt-1 text-sm text-muted-foreground">
                                {cuota.value}
                              </p> */}
                            </div>

                            <div
                              className={cn(
                                "ml-4 flex size-6 shrink-0 items-center justify-center rounded-full border transition-all",
                                selected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-muted-foreground/30 bg-background text-transparent",
                              )}
                            >
                              <Check className="size-3.5" strokeWidth={2.5} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed p-5 text-center">
                      <p className="text-sm text-muted-foreground">
                        No hay planes de financiación configurados.
                      </p>
                    </div>
                  )}

                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </div>
              );
            }}
          />
        </div>
        <ControllerInput
          name="by_brand_warranty"
          control={form.control}
          label="Garantía de la marca"
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
        )
        <Separator />
        {/* Garantía */}
        <ControllerInput
          name="warranty_type_id"
          control={form.control}
          label="Garantía"
          optional
        >
          {({ field, fieldState }) => (
            <WarrantyTypesSelector
              value={field.value as string | undefined}
              onValueChange={field.onChange}
              ariaInvalid={fieldState.invalid}
              disabled={field.disabled}
            />
          )}
        </ControllerInput>
      </div>
    </VehicleFormStep>
  );
};
