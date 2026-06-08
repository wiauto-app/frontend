"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ControlledInput } from "@/components/forms/controlledInput";
import { CustomCheckbox } from "@/components/ui/customCheckbox";
import { leadService } from "@/services/leadService";
import type { VehicleDetailAdvertiser } from "../types/vehicle-detail.types";
import {
  authenticatedContactFormSchema,
  guestContactFormSchema,
  type AuthenticatedContactFormValues,
  type GuestContactFormValues,
} from "../schemas/contactForm.schema";

type VehicleDetailContactFormProps = {
  vehicleId: string;
  publisherProfileId: string;
  advertiser: VehicleDetailAdvertiser;
};

const defaultGuestValues: GuestContactFormValues = {
  name: "",
  email: "",
  phone: {
    phone_code: "",
    phone: "",
  },
  message: "",
  accepted_terms: false,
};

const defaultAuthenticatedValues: AuthenticatedContactFormValues = {
  name: "",
  email: "",
  phone: {
    phone_code: "",
    phone: "",
  },
  message: "",
  accepted_terms: false,
};

const buildAuthenticatedName = (name?: string, lastName?: string): string =>
  `${name ?? ""} ${lastName ?? ""}`.trim();

export const VehicleDetailContactForm = ({
  vehicleId,
}: VehicleDetailContactFormProps) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useUser();

  const guestForm = useForm<GuestContactFormValues>({
    resolver: zodResolver(guestContactFormSchema),
    defaultValues: defaultGuestValues,
  });

  const authenticatedForm = useForm<AuthenticatedContactFormValues>({
    resolver: zodResolver(authenticatedContactFormSchema),
    defaultValues: defaultAuthenticatedValues,
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    authenticatedForm.reset({
      ...defaultAuthenticatedValues,
      name: buildAuthenticatedName(user.name, user.last_name),
      email: user.email,
    });
  }, [isAuthenticated, user, authenticatedForm]);

  const handleGuestSubmit = async (data: GuestContactFormValues) => {
    const response = await leadService.create(vehicleId, {
      name: data.name,
      email: data.email,
      phone: data.phone.phone,
      phone_code: data.phone.phone_code,
      message: data.message,
      accepted_terms: data.accepted_terms,
    });

    if (!response.ok) {
      toast.error(response.message || "No se pudo enviar la consulta");
      return;
    }

    toast.success("Consulta enviada");
    guestForm.reset(defaultGuestValues);
  };

  const handleAuthenticatedSubmit = async (
    data: AuthenticatedContactFormValues,
  ) => {
    const response = await leadService.create(vehicleId, {
      name: data.name,
      email: data.email,
      phone: data.phone?.phone?.trim() || undefined,
      phone_code: data.phone?.phone_code?.trim() || undefined,
      message: data.message,
      accepted_terms: data.accepted_terms,
    });

    if (!response.ok) {
      toast.error(response.message || "No se pudo enviar la consulta");
      return;
    }

    if (response.data?.chat_id) {
      toast.success("Consulta enviada. Te redirigimos al chat.");
      router.push(`/mensajes?chat_id=${response.data.chat_id}`);
      return;
    }

    toast.success("Consulta enviada");
    authenticatedForm.reset({
      ...defaultAuthenticatedValues,
      name: buildAuthenticatedName(user?.name, user?.last_name),
      email: user?.email ?? "",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4 text-sm text-gray-500">
        <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <form onSubmit={guestForm.handleSubmit(handleGuestSubmit)}>
        <h3 className="mb-4 font-semibold text-gray-900">
          Contacta con el anunciante
        </h3>

        <div className="space-y-4">
          <ControlledInput
            name="name"
            control={guestForm.control}
            label="Nombre"
          />
          <ControlledInput
            name="email"
            control={guestForm.control}
            label="Email"
            type="email"
            placeholder="email@example.com"
          />
          <ControlledInput
            name="phone"
            control={guestForm.control}
            label="Teléfono"
            type="phone"
          />
          <ControlledInput
            name="message"
            control={guestForm.control}
            label="Mensaje"
            type="textarea"
            placeholder="Mensaje"
            rows={3}
          />
          <Controller
            name="accepted_terms"
            control={guestForm.control}
            render={({ field }) => (
              <CustomCheckbox
                id="accept-terms-detail-guest"
                checked={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                label="Acepto las condiciones de uso y la información básica de mis datos"
              />
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={guestForm.formState.isSubmitting}
          >
            {guestForm.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Enviando...
              </>
            ) : (
              "Contactar"
            )}
          </Button>

          <Button type="button" variant="link" className="w-full">
            Ir al simulador de financiamiento →
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={authenticatedForm.handleSubmit(handleAuthenticatedSubmit)}>
      <h3 className="mb-4 font-semibold text-gray-900">
        Contacta con el anunciante
      </h3>

      <div className="space-y-4">
        <ControlledInput
          name="name"
          control={authenticatedForm.control}
          label="Nombre"
        >
          {({ field, fieldState }) => (
            <Input
              id="contact-name-auth"
              name={field.name}
              value={typeof field.value === "string" ? field.value : ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              disabled
              aria-invalid={fieldState.invalid}
            />
          )}
        </ControlledInput>
        <ControlledInput
          name="email"
          control={authenticatedForm.control}
          label="Email"
          type="email"
        >
          {({ field, fieldState }) => (
            <Input
              id="contact-email-auth"
              name={field.name}
              type="email"
              value={typeof field.value === "string" ? field.value : ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              disabled
              aria-invalid={fieldState.invalid}
            />
          )}
        </ControlledInput>
        <ControlledInput
          name="phone"
          control={authenticatedForm.control}
          label="Teléfono"
          type="phone"
          optional
        />
        <ControlledInput
          name="message"
          control={authenticatedForm.control}
          label="Mensaje"
          type="textarea"
          placeholder="Mensaje"
          rows={3}
        />
        <Controller
          name="accepted_terms"
          control={authenticatedForm.control}
          render={({ field }) => (
            <CustomCheckbox
              id="accept-terms-detail-auth"
              checked={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              label="Acepto las condiciones de uso y la información básica de mis datos"
            />
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={authenticatedForm.formState.isSubmitting}
        >
          {authenticatedForm.formState.isSubmitting ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Enviando...
            </>
          ) : (
            "Contactar"
          )}
        </Button>

        <Button type="button" variant="link" className="w-full">
          Ir al simulador de financiamiento →
        </Button>
      </div>
    </form>
  );
};
