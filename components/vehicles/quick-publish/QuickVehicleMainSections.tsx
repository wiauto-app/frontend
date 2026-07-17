"use client";

import { Controller, useFormContext } from "react-hook-form";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { MapInput } from "@/components/forms/mapInput";
import { PhoneInput } from "@/components/forms/phoneInput";
import { ControllerInput } from "@/components/ui/controllerInput";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { QuickCatalogFields } from "./QuickCatalogFields";
import { QuickVehicleClassificationFields } from "./QuickVehicleClassificationFields";
import { QuickVehicleMediaStep } from "./QuickVehicleMediaStep";
import { QuickVehicleAiDescriptionCard } from "./QuickVehicleAiDescriptionCard";
import { QuickVehiclePricingFields } from "./QuickVehiclePricingFields";
import { QuickVehicleTechnicalFields } from "./QuickVehicleTechnicalFields";
import { GeneratedDescriptionConfig } from "./generatedDescription/generatedDescriptionConfig";

interface QuickVehicleMainSectionsProps {
  vehicleId?: string;
  contactName: string;
}

export const QuickVehicleMainSections = ({
  vehicleId,
  contactName,
}: QuickVehicleMainSectionsProps) => {
  const form = useFormContext<QuickVehicleSchema>();
  const phoneValue = form.watch("phone");

  return (
    <div className="flex flex-col gap-12">
      <QuickVehicleMediaStep vehicleId={vehicleId} />

      <VehicleFormStep number={2} label="¿Qué vehículo vendes?">
        <QuickCatalogFields />
        {form.formState.errors.version_id ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.version_id.message}
          </p>
        ) : null}
      </VehicleFormStep>

      <QuickVehiclePricingFields />
      <QuickVehicleClassificationFields />

      <VehicleFormStep number={5} label="Ficha técnica">
        <QuickVehicleTechnicalFields />
      </VehicleFormStep>

      <VehicleFormStep
        number={6}
        isOptional
        label="Descripción del vehículo"
        description="Describe el estado, historial y puntos destacados del vehículo."
      >
        <div className="flex flex-col gap-4">
          <QuickVehicleAiDescriptionCard />
          <GeneratedDescriptionConfig />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="quick-description">Descripción</FieldLabel>
                <Textarea
                  {...field}
                  id="quick-description"
                  className="h-72 resize-none whitespace-pre-wrap"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
        </div>
      </VehicleFormStep>

      <VehicleFormStep number={7} label="Ubicación">
        <Controller
          name="lat"
          control={form.control}
          render={({ field: latField, fieldState }) => {
            const lng = form.watch("lng");
            return (
              <MapInput
                value={{ lat: latField.value, lng }}
                onChange={({ lat, lng: nextLng }) => {
                  latField.onChange(lat);
                  form.setValue("lng", nextLng, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                ariaInvalid={
                  fieldState.invalid || Boolean(form.formState.errors.lng)
                }
              />
            );
          }}
        />
      </VehicleFormStep>

      <VehicleFormStep number={8} label="Tu contacto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="contact-name">Nombre</FieldLabel>
            <Input id="contact-name" value={contactName} readOnly disabled />
          </Field>
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  ariaInvalid={fieldState.invalid}
                />
                {fieldState.error ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
          <ControllerInput name="email" control={form.control} label="Email">
            {({ field, fieldState }) => (
              <Input
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                ref={field.ref}
                value={String(field.value ?? "")}
                type="email"
                aria-invalid={fieldState.invalid}
              />
            )}
          </ControllerInput>
        </div>

        <Controller
          name="show_phone"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="space-y-1">
                  <FieldLabel htmlFor="quick-show-phone">
                    Mostrar teléfono en el anuncio
                  </FieldLabel>
                  <FieldDescription>
                    Si lo desactivas, se ocultará el contacto telefónico en el
                    anuncio público.
                  </FieldDescription>
                </div>
                <Switch
                  id="quick-show-phone"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label="Mostrar teléfono en el anuncio"
                />
              </div>
            </Field>
          )}
        />

        <Controller
          name="has_whatsapp"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="space-y-1">
                  <FieldLabel htmlFor="quick-has-whatsapp">
                    Disponible por WhatsApp
                  </FieldLabel>
                  <FieldDescription>
                    Indica si el número de contacto puede recibir mensajes por
                    WhatsApp.
                  </FieldDescription>
                </div>
                <Switch
                  id="quick-has-whatsapp"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={!phoneValue?.phone?.trim()}
                  aria-label="Disponible por WhatsApp"
                />
              </div>
            </Field>
          )}
        />
      </VehicleFormStep>
    </div>
  );
};
