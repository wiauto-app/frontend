"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ControlledInput } from "@/components/forms/controlledInput";
import { Button } from "@/components/ui/button";
import { MakeSelector } from "@/components/dynamicSelectors/makeSelector";
import { ModelSelector } from "@/components/dynamicSelectors/modelSelector";
import { VersionSelector } from "@/components/dynamicSelectors/versionSelector";
import { trackLead } from "@/lib/analytics/events";
import { leadsService } from "@/services/leads/leadsService";

import {
  segurosLeadDefaultValues,
  segurosLeadSchema,
  type SegurosLeadFormValues,
} from "../schemas/seguros-lead.schema";

interface SegurosLeadFormProps {
  onSuccess?: () => void;
}

export const SegurosLeadForm = ({ onSuccess }: SegurosLeadFormProps) => {
  const form = useForm<SegurosLeadFormValues>({
    resolver: zodResolver(segurosLeadSchema),
    defaultValues: segurosLeadDefaultValues,
  });

  const catalogMakeId = form.watch("catalog_make_id");
  const catalogModelId = form.watch("catalog_model_id");
  const versionId = form.watch("version_id");

  const handleSubmit = async (data: SegurosLeadFormValues) => {
    try {
      const response = await leadsService.create({
        type: "seguros",
        first_name: data.firstName,
        last_name: data.lastName,
        dni: data.dni,
        phone: data.phone,
        email: data.email,
        extra_data: {
          catalog_make_id: data.catalog_make_id,
          catalog_model_id: data.catalog_model_id,
          version_id: data.version_id,
          license_plate: data.licensePlate || undefined,
        },
      });

      if (!response.ok) {
        throw new Error(response.message);
      }

      trackLead({ contentName: "Solicitud de seguro" });
      toast.success("Solicitud enviada. Te contactaremos pronto.");
      form.reset(segurosLeadDefaultValues);
      onSuccess?.();
    } catch {
      toast.error("No se pudo enviar la solicitud. Inténtalo de nuevo.");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      aria-label="Formulario de solicitud de seguro"
      className="flex flex-col gap-4"
      noValidate
    >
      <fieldset className="space-y-2">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Tus datos
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ControlledInput
            name="firstName"
            control={form.control}
            label="Nombre"
            placeholder="Nombre"
            type="text"
          />
          <ControlledInput
            name="lastName"
            control={form.control}
            label="Apellidos"
            placeholder="Apellidos"
            type="text"
          />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ControlledInput
            name="dni"
            control={form.control}
            label="DNI"
            placeholder="12345678Z"
            type="text"
          />
          <ControlledInput
            name="phone"
            control={form.control}
            label="Teléfono"
            placeholder="612345678"
            type="tel"
          />
        </div>
        <ControlledInput
          name="email"
          control={form.control}
          label="Correo electrónico"
          placeholder="ejemplo@correo.com"
          type="email"
        />
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Tu vehículo
        </legend>
        <ControlledInput
          name="licensePlate"
          control={form.control}
          label="Matrícula"
          placeholder="1234 ABC"
          type="text"
          optional
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <MakeSelector
            value={catalogMakeId ? String(catalogMakeId) : undefined}
            ariaInvalid={Boolean(form.formState.errors.catalog_make_id)}
            onChange={(value) => {
              form.setValue(
                "catalog_make_id",
                value ? Number(value) : (undefined as unknown as number),
                { shouldDirty: true, shouldValidate: true },
              );
              form.setValue("catalog_model_id", undefined as unknown as number, {
                shouldDirty: true,
              });
              form.setValue("version_id", undefined, { shouldDirty: true });
            }}
          />
          <ModelSelector
            makeId={catalogMakeId || undefined}
            value={catalogModelId ? String(catalogModelId) : undefined}
            ariaInvalid={Boolean(form.formState.errors.catalog_model_id)}
            onChange={(value) => {
              form.setValue(
                "catalog_model_id",
                value ? Number(value) : (undefined as unknown as number),
                { shouldDirty: true, shouldValidate: true },
              );
              form.setValue("version_id", undefined, { shouldDirty: true });
            }}
          />
        </div>
        <VersionSelector
          makeId={catalogMakeId || undefined}
          modelId={catalogModelId || undefined}
          value={versionId ? String(versionId) : undefined}
          onChange={(value) => {
            form.setValue("version_id", value ? Number(value) : undefined, {
              shouldDirty: true,
            });
          }}
        />
      </fieldset>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
      >
        {form.formState.isSubmitting ? "Enviando..." : "Solicitar seguro"}
      </Button>
    </form>
  );
};
