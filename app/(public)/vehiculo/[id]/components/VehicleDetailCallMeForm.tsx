"use client";

import { useEffect } from "react";
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
import { trackMetaLead } from "@/lib/analytics/metaPixel";
import {
  authenticatedCallMeFormSchema,
  guestCallMeFormSchema,
  type AuthenticatedCallMeFormValues,
  type GuestCallMeFormValues,
} from "../schemas/callMeForm.schema";

interface VehicleDetailCallMeFormProps {
  vehicleId: string;
}

const defaultGuestValues: GuestCallMeFormValues = {
  name: "",
  phone: {
    phone_code: "",
    phone: "",
  },
  callback_scheduled_at: "",
  accepted_terms: false,
};

const defaultAuthenticatedValues: AuthenticatedCallMeFormValues = {
  name: "",
  phone: {
    phone_code: "",
    phone: "",
  },
  callback_scheduled_at: "",
  accepted_terms: false,
};

const buildAuthenticatedName = (name?: string, lastName?: string): string =>
  `${name ?? ""} ${lastName ?? ""}`.trim();

const getTodayMinDate = (): string => new Date().toISOString().split("T")[0]!;

export const VehicleDetailCallMeForm = ({
  vehicleId,
}: VehicleDetailCallMeFormProps) => {
  const { user, isAuthenticated, isLoading } = useUser();
  const todayMinDate = getTodayMinDate();

  const guestForm = useForm<GuestCallMeFormValues>({
    resolver: zodResolver(guestCallMeFormSchema),
    defaultValues: defaultGuestValues,
  });

  const authenticatedForm = useForm<AuthenticatedCallMeFormValues>({
    resolver: zodResolver(authenticatedCallMeFormSchema),
    defaultValues: defaultAuthenticatedValues,
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    authenticatedForm.reset({
      ...defaultAuthenticatedValues,
      name: buildAuthenticatedName(user.name, user.last_name),
    });
  }, [isAuthenticated, user, authenticatedForm]);

  const handleGuestSubmit = async (data: GuestCallMeFormValues) => {
    const response = await leadService.createCallMe(vehicleId, {
      name: data.name,
      phone: data.phone.phone,
      phone_code: data.phone.phone_code,
      callback_scheduled_at: data.callback_scheduled_at,
      accepted_terms: data.accepted_terms,
    });

    if (!response.ok) {
      toast.error(response.message || "No se pudo solicitar la llamada");
      return;
    }

    trackMetaLead({ contentName: "Solicitud de llamada", vehicleId });
    toast.success("Solicitud de llamada enviada");
    guestForm.reset(defaultGuestValues);
  };

  const handleAuthenticatedSubmit = async (
    data: AuthenticatedCallMeFormValues,
  ) => {
    const response = await leadService.createCallMe(vehicleId, {
      name: data.name,
      phone: data.phone.phone,
      phone_code: data.phone.phone_code,
      callback_scheduled_at: data.callback_scheduled_at,
      accepted_terms: data.accepted_terms,
    });

    if (!response.ok) {
      toast.error(response.message || "No se pudo solicitar la llamada");
      return;
    }

    trackMetaLead({ contentName: "Solicitud de llamada", vehicleId });
    toast.success("Solicitud de llamada enviada");
    authenticatedForm.reset({
      ...defaultAuthenticatedValues,
      name: buildAuthenticatedName(user?.name, user?.last_name),
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
          Solicita que te llamen
        </h3>

        <div className="space-y-4">
          <ControlledInput
            name="name"
            placeholder="Nombre"
            control={guestForm.control}
            label="Nombre"
            showLabel={false}
          />
          <ControlledInput
            name="phone"
            placeholder="Teléfono"
            control={guestForm.control}
            label="Teléfono"
            type="phone"
            showLabel={false}
          />
          <ControlledInput
            name="callback_scheduled_at"
            control={guestForm.control}
            label="Fecha preferida de llamada"
            type="date"
            showLabel={false}
          >
            {({ field, fieldState }) => (
              <Input
                id="call-me-date-guest"
                name={field.name}
                type="date"
                min={todayMinDate}
                value={typeof field.value === "string" ? field.value : ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                aria-invalid={fieldState.invalid}
                aria-label="Fecha preferida de llamada"
              />
            )}
          </ControlledInput>
          <Controller
            name="accepted_terms"
            control={guestForm.control}
            render={({ field }) => (
              <CustomCheckbox
                id="accept-terms-call-me-guest"
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
              "Solicitar llamada"
            )}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={authenticatedForm.handleSubmit(handleAuthenticatedSubmit)}>
      <h3 className="mb-4 font-semibold text-gray-900">
        Solicita que te llamen
      </h3>

      <div className="space-y-4">
        <ControlledInput
          name="name"
          control={authenticatedForm.control}
          label="Nombre"
        >
          {({ field, fieldState }) => (
            <Input
              id="call-me-name-auth"
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
          name="phone"
          control={authenticatedForm.control}
          label="Teléfono"
          type="phone"
        />
        <ControlledInput
          name="callback_scheduled_at"
          control={authenticatedForm.control}
          label="Fecha preferida de llamada"
        >
          {({ field, fieldState }) => (
            <Input
              id="call-me-date-auth"
              name={field.name}
              type="date"
              min={todayMinDate}
              value={typeof field.value === "string" ? field.value : ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              aria-invalid={fieldState.invalid}
              aria-label="Fecha preferida de llamada"
            />
          )}
        </ControlledInput>
        <Controller
          name="accepted_terms"
          control={authenticatedForm.control}
          render={({ field }) => (
            <CustomCheckbox
              id="accept-terms-call-me-auth"
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
            "Solicitar llamada"
          )}
        </Button>
      </div>
    </form>
  );
};
