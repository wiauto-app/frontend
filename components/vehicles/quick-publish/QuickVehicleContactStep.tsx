"use client";

import { Controller, useFormContext } from "react-hook-form";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { MapInput, type MapInputValue } from "@/components/forms/mapInput";
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
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { useEntitlements } from "@/hooks/useEntitlements";

interface QuickVehicleContactStepProps {
  contactName: string;
  isEditMode?: boolean;
}

interface QuickVehicleSwitchRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const QuickVehicleSwitchRow = ({
  id,
  label,
  description,
  checked,
  disabled,
  onCheckedChange,
}: QuickVehicleSwitchRowProps) => (
  <Field>
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <div className="space-y-1">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <FieldDescription>{description}</FieldDescription>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  </Field>
);

/** Pantalla «Contacto y publicar»: ubicación y datos de contacto. */
export const QuickVehicleContactStep = ({
  contactName,
  isEditMode = false,
}: QuickVehicleContactStepProps) => {
  const form = useFormContext<QuickVehicleSchema>();
  const phoneValue = form.watch("phone");
  const lng = form.watch("lng");
  const { isSubscribed } = useEntitlements();

  const handleLocationChange = ({ lat, lng: nextLng }: MapInputValue) => {
    const options = { shouldDirty: true, shouldValidate: true } as const;
    form.setValue("lat", lat, options);
    form.setValue("lng", nextLng, options);
  };

  return (
    <div className="flex flex-col gap-10">
      <VehicleFormStep
        number={1}
        label="¿Dónde está el vehículo?"
        description="Escribe el código postal o la ciudad, o usa tu ubicación actual."
      >
        {isSubscribed ? (
          <ControllerInput
            tooltipContent="Si lo activas, se mostrará la ubicación exacta del vehículo en el anuncio público."
            name="show_exact_location"
            control={form.control}
            label="Mostrar ubicación exacta"
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
        ) : null}
        <Controller
          name="lat"
          control={form.control}
          render={({ field: latField, fieldState }) => {
            const locationError =
              fieldState.error ?? form.formState.errors.lng;

            return (
              <div data-field-name="lat" className="flex flex-col gap-2">
                <MapInput
                  value={{ lat: latField.value, lng }}
                  onChange={handleLocationChange}
                  ariaInvalid={Boolean(locationError)}
                  autoLocateWhenPermitted={!isEditMode}
                  searchPlaceholder="Código postal o ciudad"
                />
                {locationError ? (
                  <FieldError errors={[locationError]} />
                ) : null}
              </div>
            );
          }}
        />
      </VehicleFormStep>

      <VehicleFormStep number={2} label="Tu contacto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="contact-name">Nombre</FieldLabel>
            <Input
              id="contact-name"
              value={contactName}
              placeholder="Se completará al iniciar sesión"
              readOnly
              disabled
            />
          </Field>
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-field-name="phone" data-invalid={fieldState.invalid}>
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
                inputMode="email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
            )}
          </ControllerInput>
        </div>

        <Controller
          name="show_phone"
          control={form.control}
          render={({ field }) => (
            <QuickVehicleSwitchRow
              id="quick-show-phone"
              label="Mostrar teléfono en el anuncio"
              description="Si lo desactivas, se ocultará el contacto telefónico en el anuncio público."
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="has_whatsapp"
          control={form.control}
          render={({ field }) => (
            <QuickVehicleSwitchRow
              id="quick-has-whatsapp"
              label="Disponible por WhatsApp"
              description="Indica si el número de contacto puede recibir mensajes por WhatsApp."
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={!phoneValue?.phone?.trim()}
            />
          )}
        />

        {isSubscribed ? (
          <Controller
            name="show_review_collab"
            control={form.control}
            render={({ field }) => (
              <QuickVehicleSwitchRow
                id="quick-show-review-collab"
                label="Mostrar revisión de colaboración"
                description="Si lo activas, se mostrará la revisión de colaboración en el anuncio público."
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        ) : null}
      </VehicleFormStep>
    </div>
  );
};
