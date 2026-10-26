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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useUser } from "@/app/contexts/auth/useUser";
import {
  DEALERSHIP_FINANCING_STATUS_QUERY_KEY,
  dealershipFinancingService,
} from "@/services/dealershipFinancingService";
import { useEffect } from "react";

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

  const { user } = useUser();
  const membership = user?.dealership_membership ?? null;
  const canManageFinancing =
    membership?.role === "owner" || membership?.role === "admin";
  const showLegacyCatalogFinancing = !membership;

  const { data: cuotas_page } = useQuery({
    queryKey: ["cuotas", "all-plans"],
    queryFn: () => cuotasService.findAll({ page: 1, limit: 100 }),
    enabled: showLegacyCatalogFinancing,
  });

  const cuotas = cuotas_page?.data ?? [];

  const { data: financing_status } = useQuery({
    queryKey: DEALERSHIP_FINANCING_STATUS_QUERY_KEY,
    enabled: Boolean(membership),
    retry: false,
    queryFn: async () => {
      const response = await dealershipFinancingService.getStatus();
      return response.ok && response.data ? response.data : { enabled: false };
    },
  });

  const financing_available =
    Boolean(membership) && financing_status?.enabled === true;

  useEffect(() => {
    if (!membership) {
      return;
    }

    form.setValue("cuota_ids", [], { shouldDirty: false });
    form.setValue("finance_price", undefined, { shouldDirty: false });
    form.setValue("show_first_cuota", false, { shouldDirty: false });
  }, [form, membership]);

  return (
    <VehicleFormStep number={1} label="Garantía y financiación">
      <div className="space-y-7">
        {membership ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Financiación</p>
            <ControllerInput
              name="offer_financing"
              control={form.control}
              label="Ofrecer financiación de mi concesionario"
              orientation="horizontal"
            >
              {({ field, fieldState }) => (
                <div className="space-y-1">
                  <Switch
                    checked={financing_available && (field.value as boolean)}
                    disabled={!financing_available}
                    onCheckedChange={(checked) =>
                      field.onChange(checked as boolean)
                    }
                    aria-invalid={fieldState.invalid}
                  />
                  {financing_available ? (
                    <p className="text-xs text-muted-foreground">
                      Las condiciones (TIN, plazos, comisiones) se gestionan en
                      Mi financiación. Aquí solo activas la cuota en este
                      anuncio.
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Tu concesionario aún no tiene la financiación activa.{" "}
                      {canManageFinancing ? (
                        <Link
                          href="/usuario/mi-financiacion"
                          className="font-medium text-primary underline"
                        >
                          Configurar en Mi financiación
                        </Link>
                      ) : (
                        "Pide al propietario o a un administrador que la configure."
                      )}
                    </p>
                  )}
                </div>
              )}
            </ControllerInput>
          </div>
        ) : null}

        {showLegacyCatalogFinancing ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Financiación orientativa
            </p>
            <p className="text-xs text-muted-foreground">
              Cuota aproximada a partir del precio y los plazos del catálogo.
              No sustituye la financiación de un concesionario.
            </p>
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
                                field.onChange(
                                  toggleCuotaIdInList(ids, cuota.id),
                                )
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
                                    selected
                                      ? "text-primary"
                                      : "text-foreground",
                                  )}
                                >
                                  {cuota.name}
                                </p>
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
                  max={9999999}
                  aria-invalid={fieldState.invalid}
                />
              )}
            </ControllerInput>
            <ControllerInput
              name="show_first_cuota"
              control={form.control}
              label="Mostrar primera cuota"
              orientation="horizontal"
            >
              {({ field, fieldState }) => (
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={(checked) =>
                    field.onChange(checked as boolean)
                  }
                  aria-invalid={fieldState.invalid}
                />
              )}
            </ControllerInput>
          </div>
        ) : null}

        <Separator />

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Garantía</p>
          <ControllerInput
            name="by_brand_warranty"
            control={form.control}
            label="Garantía de la marca"
            orientation="horizontal"
          >
            {({ field, fieldState }) => (
              <Switch
                checked={field.value as boolean}
                onCheckedChange={(checked) =>
                  field.onChange(checked as boolean)
                }
                aria-invalid={fieldState.invalid}
              />
            )}
          </ControllerInput>
          <ControllerInput
            name="warranty_type_id"
            control={form.control}
            label="Tipo de garantía"
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
      </div>
    </VehicleFormStep>
  );
};
