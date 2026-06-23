"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { ControllerInput } from "@/components/ui/controllerInput";
import { WarrantyTypesSelector } from "@/components/dynamicSelectors/warrantyTypesSelector";
import { featuresService } from "@/components/vehicles/services/featuresService";
import { catalogServicesService } from "@/components/vehicles/services/catalogServicesService";
import { cuotasService } from "@/components/vehicles/services/cuotasService";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { toggleCatalogIdInList } from "@/components/vehicles/utils/toggleCatalogIdInList";

const toggleCuotaIdInList = (
  current_ids: string[],
  cuota_id: string,
  checked: boolean,
): string[] => {
  if (checked) {
    if (current_ids.includes(cuota_id)) {
      return current_ids;
    }
    return [...current_ids, cuota_id];
  }
  return current_ids.filter((id) => id !== cuota_id);
};

export const QuickVehicleOptionalSections = () => {
  const form = useFormContext<QuickVehicleSchema>();

  const { data: features } = useQuery({
    queryKey: ["features"],
    queryFn: () => featuresService.findAll({ page: 1, limit: 100 }),
  });

  const { data: services } = useQuery({
    queryKey: ["catalog-services"],
    queryFn: () => catalogServicesService.findAll({ page: 1, limit: 100 }),
  });

  const { data: cuotas_page } = useQuery({
    queryKey: ["cuotas", "all-plans"],
    queryFn: () => cuotasService.findAll({ page: 1, limit: 100 }),
  });

  const cuotas = cuotas_page?.data ?? [];

  return (
    <div id="quick-optional-sections" className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">Añade más detalles (opcional)</h3>
      <Accordion>
        <AccordionItem value="features">
          <AccordionTrigger>Equipamiento y extras (opcional)</AccordionTrigger>
          <AccordionContent>
            <Controller
              name="features_ids"
              control={form.control}
              render={({ field, fieldState }) => {
                const ids = field.value ?? [];
                return (
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    {features?.data.map((feature) => {
                      const checkboxId = `quick-feature-${feature.id}`;
                      return (
                        <Field
                          key={feature.id}
                          orientation="horizontal"
                          className="flex-row-reverse items-center gap-3"
                        >
                          <FieldLabel htmlFor={checkboxId}>{feature.name}</FieldLabel>
                          <Checkbox
                            id={checkboxId}
                            checked={ids.includes(feature.id)}
                            onCheckedChange={(checked) =>
                              field.onChange(
                                toggleCatalogIdInList(ids, feature.id, checked === true),
                              )
                            }
                          />
                        </Field>
                      );
                    })}
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                  </div>
                );
              }}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="services">
          <AccordionTrigger>Servicios (opcional)</AccordionTrigger>
          <AccordionContent>
            <Controller
              name="services_ids"
              control={form.control}
              render={({ field, fieldState }) => {
                const ids = field.value ?? [];
                return (
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    {(services?.data ?? []).map((service) => {
                      const checkboxId = `quick-service-${service.id}`;
                      return (
                        <Field
                          key={service.id}
                          orientation="horizontal"
                          className="flex-row-reverse items-center gap-3"
                        >
                          <FieldLabel htmlFor={checkboxId}>{service.name}</FieldLabel>
                          <Checkbox
                            id={checkboxId}
                            checked={ids.includes(service.id)}
                            onCheckedChange={(checked) =>
                              field.onChange(
                                toggleCatalogIdInList(ids, service.id, checked === true),
                              )
                            }
                          />
                        </Field>
                      );
                    })}
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                  </div>
                );
              }}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cuotas">
          <AccordionTrigger>Cuotas / financiación (opcional)</AccordionTrigger>
          <AccordionContent>
            <p className="pb-2 text-sm text-muted-foreground">
              Marca uno o más planes disponibles para este anuncio.
            </p>
            <Controller
              name="cuota_ids"
              control={form.control}
              render={({ field, fieldState }) => {
                const ids = Array.isArray(field.value) ? field.value : [];

                return (
                  <>
                    <div className="grid grid-cols-1 gap-2">
                      {cuotas.map((cuota) => {
                        const checkbox_id = `quick-cuota-${cuota.id}`;
                        const label = `${cuota.name} (${cuota.value})`;

                        return (
                          <Field
                            key={cuota.id}
                            orientation="horizontal"
                            className="flex-row-reverse items-center gap-3"
                            data-invalid={fieldState.invalid}
                          >
                            <FieldLabel htmlFor={checkbox_id}>{label}</FieldLabel>
                            <Checkbox
                              id={checkbox_id}
                              checked={ids.includes(cuota.id)}
                              onCheckedChange={(checked) => {
                                field.onChange(
                                  toggleCuotaIdInList(ids, cuota.id, checked === true),
                                );
                              }}
                              aria-invalid={fieldState.invalid}
                            />
                          </Field>
                        );
                      })}
                    </div>
                    {!cuotas.length ? (
                      <p className="text-sm text-muted-foreground">
                        No hay planes configurados.
                      </p>
                    ) : null}
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                  </>
                );
              }}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="warranty">
          <AccordionTrigger>Garantía (opcional)</AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
