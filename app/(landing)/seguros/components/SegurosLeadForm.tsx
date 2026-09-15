"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ControlledInput } from "@/components/forms/controlledInput";
import { Button } from "@/components/ui/button";
import { trackLead } from "@/lib/analytics/events";

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

  const handleSubmit = async (data: SegurosLeadFormValues) => {
    try {
      // TODO: conectar con endpoint Nest de leads de seguros cuando exista.
      void data;
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
          <ControlledInput
            name="make"
            control={form.control}
            label="Marca"
            placeholder="Marca"
            type="text"
          />
          <ControlledInput
            name="model"
            control={form.control}
            label="Modelo"
            placeholder="Modelo"
            type="text"
          />
        </div>
        <ControlledInput
          name="version"
          control={form.control}
          label="Versión"
          placeholder="Versión"
          type="text"
          optional
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
