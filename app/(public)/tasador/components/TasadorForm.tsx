"use client";

import { useEffect, useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CheckCircle2 } from "lucide-react";
import { Controller, FormProvider, useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { MapInput } from "@/components/forms/mapInput";
import { PhoneInput } from "@/components/forms/phoneInput";
import { VehicleTransmissionTypeSelector } from "@/components/dynamicSelectors/vehicleTransmissionTypeSelector";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { appraisalRequestService } from "@/services/appraisalRequest/appraisalRequestService";

import {
  tasadorDefaultValues,
  tasadorSchema,
  type TasadorSchema,
} from "../schemas/tasador.schema";
import { TasadorCatalogFields } from "./TasadorCatalogFields";

export type TasadorFormVariant = "public" | "user";

interface TasadorFormProps {
  variant?: TasadorFormVariant;
}

export const TasadorForm = ({ variant = "public" }: TasadorFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useUser();

  const form = useForm<TasadorSchema>({
    resolver: standardSchemaResolver(tasadorSchema) as Resolver<TasadorSchema>,
    defaultValues: tasadorDefaultValues,
  });

  useEffect(() => {
    if (variant !== "user" || !user) {
      return;
    }

    const fullName = [user.name, user.last_name]
      .filter((part) => Boolean(part?.trim()))
      .join(" ")
      .trim();

    form.reset({
      ...tasadorDefaultValues,
      name: fullName || user.name || "",
      email: user.email ?? "",
      phone: {
        phone_code: user.phone_code || "+34",
        phone: user.phone ?? "",
      },
    });
  }, [variant, user, form]);

  const handleSubmit = async (data: TasadorSchema) => {
    const payload = {
      make_id: data.catalog_make_id,
      model_id: data.catalog_model_id,
      year_id: data.catalog_year_id,
      version_id: data.version_id,
      fuel_type_id: data.fuel_type_id,
      body_type_id: data.body_type_id,
      transmission_type: data.transmission_type,
      mileage: data.mileage,
      lat: data.lat,
      lng: data.lng,
      name: data.name.trim(),
      email: data.email.trim(),
      phone_code: data.phone.phone_code,
      phone: data.phone.phone,
    };

    const response =
      variant === "user"
        ? await appraisalRequestService.createAuthenticated(payload)
        : await appraisalRequestService.create(payload);

    if (!response.ok) {
      toast.error(response.message || "No se pudo enviar la solicitud de tasación");
      return;
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <CheckCircle2 className="size-12 text-primary" aria-hidden />
        <h2 className="text-xl font-semibold text-slate-900">
          ¡Solicitud enviada!
        </h2>
        <p className="max-w-md text-sm text-slate-600">
          Te contactaremos con una estimación de precio para tu vehículo en
          breve.
        </p>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        aria-label="Formulario de solicitud de tasación"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-900">
            Datos del vehículo
          </h2>
          <p className="text-sm text-slate-600">
            Selecciona la marca, modelo, año y versión de tu vehículo.
          </p>
        </div>

        <TasadorCatalogFields />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Controller
            name="transmission_type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="tasador-transmission">
                  Tipo de transmisión
                </FieldLabel>
                <VehicleTransmissionTypeSelector
                  value={field.value}
                  onValueChange={(value) => field.onChange(value ?? "manual")}
                />
                {fieldState.error ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <Controller
            name="mileage"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="tasador-mileage">
                  Kilometraje
                </FieldLabel>
                <Input
                  id="tasador-mileage"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="Ej. 85000"
                  name={field.name}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  value={field.value ?? 0}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-900">Ubicación</h2>
          <p className="text-sm text-slate-600">
            Indica dónde se encuentra el vehículo.
          </p>
        </div>

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

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-900">
            Tus datos de contacto
          </h2>
          <p className="text-sm text-slate-600">
            Te avisaremos por correo con la estimación.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="tasador-name">Nombre</FieldLabel>
                <Input
                  id="tasador-name"
                  autoComplete="name"
                  placeholder="Tu nombre"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.error ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="tasador-email">Email</FieldLabel>
                <Input
                  id="tasador-email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.error ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
        </div>

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="tasador-phone">Teléfono</FieldLabel>
              <PhoneInput
                value={field.value}
                onChange={field.onChange}
                ariaInvalid={fieldState.invalid}
              />
              {form.formState.errors.phone?.phone ||
              form.formState.errors.phone?.phone_code ? (
                <FieldError
                  errors={[
                    form.formState.errors.phone?.phone,
                    form.formState.errors.phone?.phone_code,
                  ]}
                />
              ) : null}
            </Field>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting
            ? "Enviando..."
            : "Solicitar tasación"}
        </Button>
      </form>
    </FormProvider>
  );
};
