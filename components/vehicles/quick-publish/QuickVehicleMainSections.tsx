"use client";

import { Controller, useFormContext } from "react-hook-form";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { MapInput } from "@/components/forms/mapInput";
import { PhoneInput } from "@/components/forms/phoneInput";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { QuickCatalogFields } from "./QuickCatalogFields";
import { QuickVehicleClassificationFields } from "./QuickVehicleClassificationFields";
import { QuickVehicleElectricFields } from "./QuickVehicleElectricFields";
import { QuickVehicleMediaStep } from "./QuickVehicleMediaStep";
import { QuickVehiclePricingFields } from "./QuickVehiclePricingFields";
import { QuickVehicleTechnicalFields } from "./QuickVehicleTechnicalFields";

type QuickVehicleMainSectionsProps = {
  vehicleId?: string;
  contactName: string;
};

export const QuickVehicleMainSections = ({
  vehicleId,
  contactName,
}: QuickVehicleMainSectionsProps) => {
  const form = useFormContext<QuickVehicleSchema>();

  return (
    <div className="flex flex-col gap-6">
      <QuickVehicleMediaStep vehicleId={vehicleId} />

      <section className="flex flex-col gap-4">
        <VehicleFormStep number={2} label="¿Qué vehículo vendes?" isRequired />
        <QuickCatalogFields />
        {form.formState.errors.version_id ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.version_id.message}
          </p>
        ) : null}
      </section>

      <QuickVehiclePricingFields />
      <QuickVehicleClassificationFields />

      <section className="flex flex-col gap-4">
        <VehicleFormStep
          number={5}
          label="Descripción del vehículo"
          isRequired
          description="Describe el estado, historial y puntos destacados del vehículo."
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="quick-description">Descripción</FieldLabel>
              <Textarea
                {...field}
                id="quick-description"
                rows={5}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />
      </section>

      <section className="flex flex-col gap-4">
        <VehicleFormStep number={6} label="Ficha técnica" isRequired />
        <QuickVehicleTechnicalFields />
        <QuickVehicleElectricFields />
      </section>

      <section className="flex flex-col gap-4">
        <VehicleFormStep number={7} label="Ubicación" isRequired />
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
                ariaInvalid={fieldState.invalid || Boolean(form.formState.errors.lng)}
              />
            );
          }}
        />
      </section>

      <section className="flex flex-col gap-4">
        <VehicleFormStep number={8} label="Tu contacto" isRequired />
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
                {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
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
      </section>
    </div>
  );
};
