"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { useUser } from "@/app/contexts/auth/useUser";
import { VehicleTransmissionTypeSelector } from "@/components/dynamicSelectors/vehicleTransmissionTypeSelector";
import { PhoneInput } from "@/components/forms/phoneInput";
import { StrapiEncabezado } from "@/components/strapi/StrapiEncabezado";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StrapiTasadorFormulario } from "@/interfaces/strapi-components.interface";
import { cn } from "@/lib/utils";

import {
  createTasadorSchema,
  TASADOR_DEFAULT_VALUES,
  type TasadorFormInput,
  type TasadorFormValues,
} from "../schemas/tasador.schema";
import { TasadorCatalogFields } from "./TasadorCatalogFields";
import { FieldError } from "./TasadorFieldError";

interface TasadorFormProps {
  content: StrapiTasadorFormulario;
  /** Valores con los que arranca (p. ej. al volver con "Modificar datos"). */
  defaultValues?: TasadorFormValues;
  isSubmitting: boolean;
  onSubmit: (values: TasadorFormValues) => void;
}

const SectionCard = ({
  step,
  children,
  className,
}: {
  step: number;
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={cn(
      "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6",
      className,
    )}
  >
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
      >
        {step}
      </span>
      <div className="flex w-full flex-col gap-5">{children}</div>
    </div>
  </section>
);

/** "¿Qué vehículo vendes?" + "Tus datos de contacto". */
export const TasadorForm = ({
  content,
  defaultValues,
  isSubmitting,
  onSubmit,
}: TasadorFormProps) => {
  const { user } = useUser();
  const schema = useMemo(() => createTasadorSchema(content), [content]);
  const form = useForm<TasadorFormInput, unknown, TasadorFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...TASADOR_DEFAULT_VALUES, ...defaultValues },
  });
  const errors = form.formState.errors;

  // Completa el contacto desde el perfil sin pisar lo que el usuario ya escribió.
  useEffect(() => {
    if (!user) {
      return;
    }
    const fill = (name: "name" | "last_name" | "email", value?: string) => {
      if (value && !form.getValues(name)) {
        form.setValue(name, value);
      }
    };
    fill("name", user.name);
    fill("last_name", user.last_name);
    fill("email", user.email);
    if (user.phone && !form.getValues("phone.phone")) {
      form.setValue("phone", {
        phone_code: user.phone_code || TASADOR_DEFAULT_VALUES.phone.phone_code,
        phone: user.phone,
      });
    }
  }, [user, form]);

  const textField = (
    name: "mileage" | "power" | "plate" | "name" | "last_name" | "email",
    field: StrapiTasadorFormulario["kilometraje"],
    options: { required?: boolean; type?: string; suffix?: string; inputMode?: "numeric" } = {},
  ) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`tasador-${name}`}>
        {field?.label}
        {options.required ? " *" : null}
      </Label>
      <div className="relative">
        <Input
          id={`tasador-${name}`}
          type={options.type ?? "text"}
          inputMode={options.inputMode}
          placeholder={field?.placeholder ?? undefined}
          aria-invalid={Boolean(errors[name])}
          disabled={isSubmitting}
          className={cn(options.suffix && "pr-12")}
          {...form.register(name)}
        />
        {options.suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-400">
            {options.suffix}
          </span>
        ) : null}
      </div>
      {field?.ayuda ? <p className="text-xs text-slate-500">{field.ayuda}</p> : null}
      <FieldError message={errors[name]?.message} />
    </div>
  );

  return (
    <FormProvider {...form}>
      <form
        id="tasador-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        <SectionCard step={1}>
          <StrapiEncabezado
            content={content.encabezado_vehiculo}
            className="text-left"
            titleClassName="text-xl sm:text-2xl"
            descriptionClassName="mt-1"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TasadorCatalogFields content={content} />

            <div className="flex flex-col gap-2">
              <Label>{content.transmision?.label} *</Label>
              <Controller
                name="transmission_type"
                control={form.control}
                render={({ field }) => (
                  <VehicleTransmissionTypeSelector
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    placeholder={content.transmision?.placeholder ?? undefined}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FieldError message={errors.transmission_type?.message} />
            </div>

            {textField("mileage", content.kilometraje, {
              required: true,
              type: "number",
              inputMode: "numeric",
              suffix: "km",
            })}
            {textField("power", content.potencia, {
              type: "number",
              inputMode: "numeric",
              suffix: "CV",
            })}
            {textField("plate", content.matricula)}
          </div>
        </SectionCard>

        <SectionCard step={2}>
          <StrapiEncabezado
            content={content.encabezado_contacto}
            className="text-left"
            titleClassName="text-xl sm:text-2xl"
            descriptionClassName="mt-1"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {textField("name", content.nombre, { required: true })}
            {textField("last_name", content.apellidos)}
            {textField("email", content.email, { required: true, type: "email" })}

            <div className="flex flex-col gap-2">
              <Label>{content.telefono?.label} *</Label>
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <PhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    ariaInvalid={fieldState.invalid}
                    nationalNumberLabel={content.telefono?.label_numero ?? undefined}
                    nationalNumberPlaceholder={content.telefono?.placeholder_numero ?? undefined}
                  />
                )}
              />
              <FieldError message={errors.phone?.phone_code?.message} />
              <FieldError message={errors.phone?.phone?.message} />
            </div>
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="w-full gap-2 sm:w-auto sm:min-w-48"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {content.boton?.label_cargando || content.boton?.label}
              </>
            ) : (
              <>
                {content.boton?.label}
                <ArrowRight className="size-4" aria-hidden />
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
