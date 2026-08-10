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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuickVehicleAiDescriptionCard } from "@/components/vehicles/quick-publish/QuickVehicleAiDescriptionCard";
import { GeneratedDescriptionConfig } from "@/components/vehicles/quick-publish/generatedDescription/generatedDescriptionConfig";
import type { VehicleFormValues } from "./form-values";

interface SharedDescriptionSectionProps {
  layout?: "quick" | "professional";
  stepNumber?: number;
}

export const SharedDescriptionSection = ({
  layout = "quick",
  stepNumber = 6,
}: SharedDescriptionSectionProps) => {
  const form = useFormContext<VehicleFormValues>();

  const content = (
    <div className="flex flex-col gap-4">
      <QuickVehicleAiDescriptionCard />
      <GeneratedDescriptionConfig />
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="vehicle-description">Descripción</FieldLabel>
            <Textarea
              {...field}
              id="vehicle-description"
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
  );

  if (layout === "professional") {
    return (
      <Card className="bg-white shadow-sm ring-1 ring-gray-100">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-base font-semibold text-gray-900">
            Texto comercial
          </CardTitle>
          <CardDescription>
            Describe el estado, historial y puntos destacados del vehículo.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">{content}</CardContent>
      </Card>
    );
  }

  return (
    <VehicleFormStep
      number={stepNumber}
      isOptional
      label="Descripción del vehículo"
      description="Describe el estado, historial y puntos destacados del vehículo."
    >
      {content}
    </VehicleFormStep>
  );
};

interface SharedLocationSectionProps {
  layout?: "quick" | "professional";
  stepNumber?: number;
}

export const SharedLocationSection = ({
  layout = "quick",
  stepNumber = 7,
}: SharedLocationSectionProps) => {
  const form = useFormContext<VehicleFormValues>();

  const content = (
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
  );

  if (layout === "professional") {
    return (
      <Card className="bg-white shadow-sm ring-1 ring-gray-100">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-base font-semibold text-gray-900">
            Ubicación
          </CardTitle>
          <CardDescription>Indica dónde se encuentra el vehículo.</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">{content}</CardContent>
      </Card>
    );
  }

  return (
    <VehicleFormStep number={stepNumber} label="Ubicación">
      {content}
    </VehicleFormStep>
  );
};

interface SharedContactSectionProps {
  contactName: string;
  layout?: "quick" | "professional";
  stepNumber?: number;
}

export const SharedContactSection = ({
  contactName,
  layout = "quick",
  stepNumber = 8,
}: SharedContactSectionProps) => {
  const form = useFormContext<VehicleFormValues>();
  const phoneValue = form.watch("phone");

  const content = (
    <div className="flex flex-col gap-4">
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
                <FieldLabel htmlFor="show-phone">
                  Mostrar teléfono en el anuncio
                </FieldLabel>
                <FieldDescription>
                  Si lo desactivas, se ocultará el contacto telefónico en el
                  anuncio público.
                </FieldDescription>
              </div>
              <Switch
                id="show-phone"
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
                <FieldLabel htmlFor="has-whatsapp">
                  Disponible por WhatsApp
                </FieldLabel>
                <FieldDescription>
                  Indica si el número de contacto puede recibir mensajes por
                  WhatsApp.
                </FieldDescription>
              </div>
              <Switch
                id="has-whatsapp"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={!phoneValue?.phone?.trim()}
                aria-label="Disponible por WhatsApp"
              />
            </div>
          </Field>
        )}
      />
    </div>
  );

  if (layout === "professional") {
    return (
      <Card className="bg-white shadow-sm ring-1 ring-gray-100">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-base font-semibold text-gray-900">
            Contacto
          </CardTitle>
          <CardDescription>
            Datos de contacto visibles en el anuncio.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">{content}</CardContent>
      </Card>
    );
  }

  return (
    <VehicleFormStep number={stepNumber} label="Tu contacto">
      {content}
    </VehicleFormStep>
  );
};
