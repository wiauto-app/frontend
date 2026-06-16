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
import { featuresService } from "@/components/vehicles/services/featuresService";
import { catalogServicesService } from "@/components/vehicles/services/catalogServicesService";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { toggleCatalogIdInList } from "@/components/vehicles/utils/toggleCatalogIdInList";

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

  return (
    <div id="quick-optional-sections" className="flex flex-col gap-3">
      <h3 className="font-semibold text-sm">Añade más detalles (opcional)</h3>
      <Accordion>
        <AccordionItem value="features">
          <AccordionTrigger>Equipamiento y extras</AccordionTrigger>
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
                        <Field key={feature.id} orientation="horizontal" className="flex-row-reverse items-center gap-3">
                          <FieldLabel htmlFor={checkboxId}>{feature.name}</FieldLabel>
                          <Checkbox
                            id={checkboxId}
                            checked={ids.includes(feature.id)}
                            onCheckedChange={(checked) =>
                              field.onChange(toggleCatalogIdInList(ids, feature.id, checked === true))
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
          <AccordionTrigger>Servicios</AccordionTrigger>
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
                        <Field key={service.id} orientation="horizontal" className="flex-row-reverse items-center gap-3">
                          <FieldLabel htmlFor={checkboxId}>{service.name}</FieldLabel>
                          <Checkbox
                            id={checkboxId}
                            checked={ids.includes(service.id)}
                            onCheckedChange={(checked) =>
                              field.onChange(toggleCatalogIdInList(ids, service.id, checked === true))
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
      </Accordion>
    </div>
  );
};
