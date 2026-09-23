"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Car,
  FileText,
  Lock,
  Mail,
  Phone,
  RectangleHorizontal,
  User,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { VehicleTypesSelector } from "@/components/dynamicSelectors/vehicleTypesSelector";
import { ControlledInput } from "@/components/forms/controlledInput";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trackLead } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import { leadsService } from "@/services/leads/leadsService";
import type { StrapiMedia } from "@/lib/strapi.types";

import {
  collabsSegurosHeroLeadDefaultValues,
  collabsSegurosHeroLeadSchema,
  type CollabsSegurosHeroLeadFormValues,
} from "../schemas/collabs-seguros-hero-lead.schema";

export const COLLABS_SEGUROS_HERO_FORM_ID = "colabs-seguros-hero-form";

interface CollabsSegurosHeroFormProps {
  formId?: string;
  title: string;
  logo?: StrapiMedia | null;
  className?: string;
}

interface IconFieldProps {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const IconField = ({ icon: Icon, children, className }: IconFieldProps) => (
  <div className={cn("relative", className)}>
    <Icon
      className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-slate-400"
      aria-hidden
    />
    {children}
  </div>
);

export const CollabsSegurosHeroForm = ({
  formId = COLLABS_SEGUROS_HERO_FORM_ID,
  title,
  logo,
  className,
}: CollabsSegurosHeroFormProps) => {
  const form = useForm<CollabsSegurosHeroLeadFormValues>({
    resolver: zodResolver(collabsSegurosHeroLeadSchema),
    defaultValues: collabsSegurosHeroLeadDefaultValues,
  });

  const handleSubmit = async (data: CollabsSegurosHeroLeadFormValues) => {
    try {
      const extra_data: Record<string, unknown> = {
        vehicle_type_id: data.vehicle_type_id,
      };

      if (data.licensePlate) {
        extra_data.license_plate = data.licensePlate;
      }

      if (data.observations) {
        extra_data.observations = data.observations;
      }

      const response = await leadsService.create({
        type: "seguros",
        first_name: data.fullName,
        phone: data.phone,
        email: data.email,
        extra_data,
      });

      if (!response.ok) {
        throw new Error(response.message);
      }

      trackLead({ contentName: "Solicitud de seguro (colaboración)" });
      toast.success("Solicitud enviada. Te contactaremos pronto.");
      form.reset(collabsSegurosHeroLeadDefaultValues);
    } catch {
      toast.error("No se pudo enviar la solicitud. Inténtalo de nuevo.");
    }
  };

  return (
    <div
      id={formId}
      className={cn(
        "w-full max-w-md scroll-mt-24 rounded-2xl bg-white p-5 shadow-xl sm:p-6",
        className,
      )}
    >
     
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        aria-label="Formulario de solicitud de seguro"
        className="flex flex-col gap-3"
        noValidate
      >
        <ControlledInput
          name="fullName"
          control={form.control}
          label="Nombre y apellidos"
          placeholder="Tu nombre y apellidos"
        >
          {({ field, fieldState }) => (
            <IconField icon={User}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Tu nombre y apellidos"
                className="pl-10"
              />
            </IconField>
          )}
        </ControlledInput>

        <ControlledInput
          name="phone"
          control={form.control}
          label="Teléfono"
          placeholder="6XX XXX XXX"
        >
          {({ field, fieldState }) => (
            <IconField icon={Phone}>
              <Input
                {...field}
                type="tel"
                aria-invalid={fieldState.invalid}
                placeholder="6XX XXX XXX"
                className="pl-10"
              />
            </IconField>
          )}
        </ControlledInput>

        <ControlledInput
          name="email"
          control={form.control}
          label="Correo electrónico"
          placeholder="ejemplo@correo.com"
        >
          {({ field, fieldState }) => (
            <IconField icon={Mail}>
              <Input
                {...field}
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="ejemplo@correo.com"
                className="pl-10"
              />
            </IconField>
          )}
        </ControlledInput>

        <Field
          className="flex flex-col gap-1"
          data-invalid={Boolean(form.formState.errors.vehicle_type_id)}
        >
          <FieldLabel htmlFor="vehicle_type_id">Tipo de vehículo</FieldLabel>
          <IconField icon={Car}>
            <VehicleTypesSelector
              value={form.watch("vehicle_type_id") || undefined}
              ariaInvalid={Boolean(form.formState.errors.vehicle_type_id)}
              placeholder="Selecciona una opción"
              triggerClassName="pl-10"
              onValueChange={(value) => {
                form.setValue("vehicle_type_id", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />
          </IconField>
          {form.formState.errors.vehicle_type_id ? (
            <FieldError errors={[form.formState.errors.vehicle_type_id]} />
          ) : null}
        </Field>

        <ControlledInput
          name="licensePlate"
          control={form.control}
          label="Matrícula"
          placeholder="1234 ABC"
          optional
        >
          {({ field, fieldState }) => (
            <IconField icon={RectangleHorizontal}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="1234 ABC"
                className="pl-10 uppercase"
              />
            </IconField>
          )}
        </ControlledInput>

        <ControlledInput
          name="observations"
          control={form.control}
          label="Observaciones"
          placeholder="Cuéntanos cualquier detalle relevante..."
          optional
        >
          {({ field, fieldState }) => (
            <div className="relative">
              <FileText
                className="pointer-events-none absolute top-3 left-3 z-10 size-4 text-slate-400"
                aria-hidden
              />
              <Textarea
                id="observations"
                placeholder="Cuéntanos cualquier detalle relevante..."
                rows={3}
                maxLength={1000}
                aria-invalid={fieldState.invalid}
                value={typeof field.value === "string" ? field.value : ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                className="pl-10"
              />
            </div>
          )}
        </ControlledInput>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-1 h-11 w-full gap-2 bg-[#0061F2] text-base font-semibold hover:bg-[#0052cc]"
          aria-label="Solicitar presupuesto"
        >
          {form.formState.isSubmitting
            ? "Enviando..."
            : "Solicitar presupuesto"}
          {!form.formState.isSubmitting ? (
            <ArrowRight className="size-4" aria-hidden />
          ) : null}
        </Button>

        <p className="flex items-start gap-2 text-xs text-slate-500">
          <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>
            Tus datos se utilizarán solo para ofrecerte una propuesta de
            seguro.
          </span>
        </p>
      </form>
    </div>
  );
};
