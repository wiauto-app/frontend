"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { AuthSocialLogins } from "./AuthSocialLogins";
import type { AuthPantallaProps } from "@/app/(auth)/types/strapi-autenticacion.types";
import { StrapiAviso } from "@/components/strapi/StrapiAviso";
import { StrapiEncabezado } from "@/components/strapi/StrapiEncabezado";
import { StrapiInlineBlocks } from "@/components/strapi/StrapiInlineBlocks";
import { StrapiTextoEnlace } from "@/components/strapi/StrapiTextoEnlace";
import {
  createRegisterSchema,
  RegisterFormValues,
} from "@/validations/Schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from "@/services/authService";
import { trackCompleteRegistration } from "@/lib/analytics/events";
import { PasswordInput } from "@/components/ui/passwordInput";
import { DEFAULT_PHONE_CODE, PhoneInput } from "@/components/forms/phoneInput";

interface RegisterFormProps extends AuthPantallaProps<"registro"> {
  invitedEmail?: string;
}

export default function RegisterForm({
  content,
  compartido,
  invitedEmail: invitedEmailProp,
}: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationEmailFromQuery = searchParams.get("email")?.trim() ?? "";
  const invitedEmail = invitedEmailProp ?? invitationEmailFromQuery;
  const isInvitationFlow = invitedEmail.length > 0;
  const [isLoading, setIsLoading] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const schema = useMemo(() => createRegisterSchema(content), [content]);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: invitedEmail ?? "",
      password: "",
      name: "",
      last_name: "",
      phone: {
        phone_code: DEFAULT_PHONE_CODE,
        phone: "",
      },
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    if (!acceptTerms) {
      toast.error(
        content.terminos?.mensaje_requerido ||
          "Debes aceptar las condiciones de uso",
      );
      return;
    }

    setIsLoading(true);
    try {
      const { phone, ...rest } = data;
      const response = await authService.register({
        ...rest,
        phone_code: phone.phone_code,
        phone: phone.phone,
      });

      if (response.ok) {
        trackCompleteRegistration("email");
        toast.success(
          content.mensajes?.exito ||
            "Revisa tu correo para verificar la cuenta e iniciar sesión.",
        );
        router.push("/confirmar-correo");
      } else {
        toast.error(response.message);
      }
    } catch (error: Error | unknown) {
      console.error("Register error:", error);
      toast.error(
        (error as Error).message ||
          content.mensajes?.error_generico ||
          "Hubo un error al crear tu cuenta. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="text-center">
        <StrapiEncabezado content={content.encabezado} />
        {isInvitationFlow ? (
          <StrapiAviso content={content.aviso_invitacion} className="mt-3" />
        ) : null}
      </div>

      <AuthSocialLogins content={compartido} disabled={isLoading} />

      <form
        id="register-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="register-name" className="mb-1 block text-gray-700">
              {content.nombre?.label} *
            </Label>
            <Input
              id="register-name"
              type="text"
              placeholder={content.nombre?.placeholder ?? undefined}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              {...form.register("name")}
              disabled={isLoading}
            />
            {form.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="register-last_name"
              className="mb-1 block text-gray-700"
            >
              {content.apellidos?.label} *
            </Label>
            <Input
              id="register-last_name"
              type="text"
              placeholder={content.apellidos?.placeholder ?? undefined}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              {...form.register("last_name")}
              disabled={isLoading}
            />
            {form.formState.errors.last_name && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="register-email" className="mb-1 block text-gray-700">
            {content.email?.label} *
          </Label>
          <Input
            id="register-email"
            type="email"
            placeholder={content.email?.placeholder ?? undefined}
            readOnly={isInvitationFlow}
            aria-readonly={isInvitationFlow}
            className={isInvitationFlow ? "bg-gray-50" : undefined}
            {...form.register("email")}
            disabled={isLoading}
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label className="mb-1 block text-gray-700">
            {content.telefono?.label} *
          </Label>
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                  ariaInvalid={fieldState.invalid}
                  nationalNumberLabel={content.telefono?.label_numero ?? undefined}
                  nationalNumberPlaceholder={
                    content.telefono?.placeholder_numero ?? undefined
                  }
                />
                {form.formState.errors.phone?.phone_code ? (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.phone.phone_code.message}
                  </p>
                ) : null}
                {form.formState.errors.phone?.phone ? (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.phone.phone.message}
                  </p>
                ) : null}
              </>
            )}
          />
        </div>

        <div>
          <Label
            htmlFor="register-password"
            className="mb-1 block text-gray-700"
          >
            {content.contrasena?.label} *
          </Label>
          <PasswordInput
            id="register-password"
            placeholder={content.contrasena?.placeholder ?? undefined}
            {...form.register("password")}
            disabled={isLoading}
          />
          {form.formState.errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="accept-terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked)}
            disabled={isLoading}
          />
          <Label className="inline font-normal leading-normal text-gray-600">
            <StrapiInlineBlocks content={content.terminos?.texto ?? null} />
          </Label>
        </div>
      </form>

      <Button
        type="submit"
        form="register-form"
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading
          ? content.boton?.label_cargando || content.boton?.label
          : content.boton?.label}
      </Button>

      <StrapiTextoEnlace content={content.pie} />
    </>
  );
}
