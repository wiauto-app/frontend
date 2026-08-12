"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneFieldValue, PhoneInput } from "@/components/forms/phoneInput";
import { PLAN_LEAD_CARS_QUANTITY_OPTIONS } from "@/app/(public)/planes/constants/cars-quantity.constants";
import { planLeadService } from "@/services/planLead/planLeadService";
import {
  planesLeadSchema,
  type PlanesLeadFormValues,
} from "@/validations/planesLead.schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ControlledInput } from "@/components/forms/controlledInput";

const defaultValues: PlanesLeadFormValues = {
  name: "",
  email: "",
  phone: {
    phone_code: "+34",
    phone: "",
  },
  cars_quantity: undefined as unknown as PlanesLeadFormValues["cars_quantity"],
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
        cars_quantity: data.cars_quantity,
        message: data.message?.trim() || undefined,
      });

      toast.success("Solicitud enviada. Te contactaremos pronto.");
      form.reset(defaultValues);
    } catch {
      toast.error("No se pudo enviar la solicitud. Inténtalo de nuevo.");
    }
  };

  return (
    <Card size="sm" className="z-10">
      <CardHeader>
        <CardTitle>¿Quieres que te asesoremos?</CardTitle>
        <CardDescription className="sr-only">
          Déjanos tus datos y te contactaremos para encontrar el plan ideal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          aria-label="Formulario de contacto para planes profesionales"
        >
          <div className="flex flex-col gap-4">
            <ControlledInput
              name="name"
              control={form.control}
              label="Nombre"
              placeholder="Tu nombre"
              type="text"
            />

            <ControlledInput
              name="email"
              control={form.control}
              label="Email"
              placeholder="Tu email"
              type="email"
            />

            <ControlledInput
              name="phone"
              control={form.control}
              label="Teléfono"
              placeholder="Tu teléfono"
              type="tel"
            >
              {({ field }) => (
                <PhoneInput
                  value={field.value as unknown as PhoneFieldValue}
                  onChange={field.onChange}
                  ariaInvalid={Boolean(form.formState.errors.phone)}
                />
              )}
            </ControlledInput>

            <ControlledInput
              name="cars_quantity"
              control={form.control}
              label="Cantidad de coches"
              placeholder="Tu mensaje"
            >
              {({ field }) => (
                <Select
                  value={field.value as string}
                  onValueChange={field.onChange}
                  items={PLAN_LEAD_CARS_QUANTITY_OPTIONS.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                >
                  <SelectTrigger
                    id="planes-lead-cars-quantity"
                    className="w-full"
                    aria-label="Cantidad de vehículos"
                    aria-invalid={Boolean(form.formState.errors.cars_quantity)}
                  >
                    <SelectValue placeholder="Selecciona un rango" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_LEAD_CARS_QUANTITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </ControlledInput>

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
              {form.formState.isSubmitting
                ? "Enviando..."
                : "Solicitar información"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
