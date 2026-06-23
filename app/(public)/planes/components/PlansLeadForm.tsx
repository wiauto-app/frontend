"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/forms/phoneInput";
import { planLeadService } from "@/services/planLead/planLeadService";
import {
  planesLeadSchema,
  type PlanesLeadFormValues,
} from "@/validations/planesLead.schema";

const defaultValues: PlanesLeadFormValues = {
  name: "",
  email: "",
  phone: {
    phone_code: "+34",
    phone: "",
  },
  message: "",
};

export const PlansLeadForm = () => {
  const form = useForm<PlanesLeadFormValues>({
    resolver: zodResolver(planesLeadSchema),
    defaultValues,
  });

  const handleSubmit = async (data: PlanesLeadFormValues) => {
    try {
      await planLeadService.create({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: `${data.phone.phone_code} ${data.phone.phone}`.trim(),
        message: data.message?.trim() || undefined,
      });

      toast.success("Solicitud enviada. Te contactaremos pronto.");
      form.reset(defaultValues);
    } catch {
      toast.error("No se pudo enviar la solicitud. Inténtalo de nuevo.");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg z-10"
      aria-label="Formulario de contacto para planes profesionales"
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-1">
        ¿Quieres que te asesoremos?
      </h3>
      <p className="text-sm text-slate-600 mb-5">
        Déjanos tus datos y te contactaremos para encontrar el plan ideal.
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="planes-lead-nombre">Nombre</Label>
          <Input
            id="planes-lead-nombre"
            autoComplete="name"
            placeholder="Tu nombre"
            aria-invalid={Boolean(form.formState.errors.name)}
            {...form.register("name")}
          />
          {form.formState.errors.name ? (
            <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="planes-lead-email">Email</Label>
          <Input
            id="planes-lead-email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="planes-lead-telefono">Teléfono</Label>
          <Controller
            control={form.control}
            name="phone"
            render={({ field }) => (
              <PhoneInput
                value={field.value}
                onChange={field.onChange}
                ariaInvalid={Boolean(form.formState.errors.phone)}
              />
            )}
          />
          {form.formState.errors.phone?.phone || form.formState.errors.phone?.phone_code ? (
            <p className="text-sm text-red-600">
              {form.formState.errors.phone?.phone?.message ??
                form.formState.errors.phone?.phone_code?.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="planes-lead-mensaje">Mensaje</Label>
          <Textarea
            id="planes-lead-mensaje"
            placeholder="Cuéntanos sobre tu concesionario o negocio"
            rows={3}
            {...form.register("message")}
          />
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {form.formState.isSubmitting ? "Enviando..." : "Solicitar información"}
        </Button>
      </div>
    </form>
  );
};
