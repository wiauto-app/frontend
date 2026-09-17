"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SendIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/forms/phoneInput";
import { leadsService } from "@/services/leads/leadsService";

import { ContactProvinceSelect } from "./ContactProvinceSelect";
import {
  contactLeadDefaultValues,
  contactLeadSchema,
  type ContactLeadFormValues,
} from "../schemas/contact.schema";

const CONTACT_LEAD_TYPE = "contacto";

export default function ContactForm() {
  const form = useForm<ContactLeadFormValues>({
    resolver: zodResolver(contactLeadSchema),
    defaultValues: contactLeadDefaultValues,
  });

  const provinceId = form.watch("province_id");

  const onSubmit = async (data: ContactLeadFormValues) => {
    try {
      const response = await leadsService.create({
        type: CONTACT_LEAD_TYPE,
        first_name: data.name,
        phone: `${data.phone_code}${data.phone}`,
        email: data.email,
        extra_data: {
          province_id: data.province_id,
          province_name: data.province_name,
          message: data.message,
        },
      });

      if (!response.ok) {
        throw new Error(response.message);
      }

      toast.success("Mensaje enviado. Te contactaremos pronto.");
      form.reset(contactLeadDefaultValues);
    } catch {
      toast.error("No se pudo enviar el mensaje. Inténtalo de nuevo.");
    }
  };

  return (
    <Card className="mx-auto my-6 w-full max-w-2xl border-0 shadow-lg shadow-primary/5 ring-1 ring-border md:my-16">
      <CardHeader className="items-center text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Estamos listos para ser tu aliado
        </p>
        <CardTitle className="text-2xl font-bold sm:text-3xl">
          Contáctanos
        </CardTitle>
        <CardDescription className="text-sm">
          Déjanos tus datos y un asesor se pondrá en contacto contigo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="contact-form"
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Nombres</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Tus nombres"
                    autoComplete="name"
                    disabled={form.formState.isSubmitting}
                  />
                  {fieldState.invalid ? (
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
                  <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="ejemplo@correo.com"
                    autoComplete="email"
                    disabled={form.formState.isSubmitting}
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Field
              data-invalid={
                Boolean(form.formState.errors.phone) ||
                Boolean(form.formState.errors.phone_code)
              }
            >
              <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
              <PhoneInput
                value={{
                  phone_code: form.watch("phone_code"),
                  phone: form.watch("phone"),
                }}
                onChange={({ phone_code, phone }) => {
                  form.setValue("phone_code", phone_code ?? "", {
                    shouldValidate: true,
                  });
                  form.setValue("phone", phone ?? "", { shouldValidate: true });
                }}
                disabled={form.formState.isSubmitting}
                ariaInvalid={Boolean(form.formState.errors.phone)}
              />
              {form.formState.errors.phone ? (
                <FieldError errors={[form.formState.errors.phone]} />
              ) : null}
            </Field>

            <ContactProvinceSelect
              value={provinceId ? String(provinceId) : undefined}
              disabled={form.formState.isSubmitting}
              ariaInvalid={Boolean(form.formState.errors.province_id)}
              onChange={(nextProvinceId, provinceName) => {
                form.setValue("province_id", nextProvinceId, {
                  shouldValidate: true,
                });
                form.setValue("province_name", provinceName);
              }}
            />
          </FieldGroup>

          <Controller
            name="message"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="message">Mensaje</FieldLabel>
                <Textarea
                  {...field}
                  id="message"
                  aria-invalid={fieldState.invalid}
                  placeholder="Contanos en qué podemos ayudarte"
                  className="min-h-32"
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <Button
            type="submit"
            form="contact-form"
            className="w-full gap-2"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Enviando...
              </span>
            ) : (
              <>
                <SendIcon className="size-4" aria-hidden />
                Enviar mensaje
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
