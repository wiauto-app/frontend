"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { AppleLogin } from "./appleLogin";
import { GoogleLogin } from "./googleLogin";
import {
  RegisterFormValues,
  RegisterSchema,
} from "@/validations/Schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from "@/services/authService";
import { trackCompleteRegistration } from "@/lib/analytics/events";
import { PasswordInput } from "@/components/ui/passwordInput";
import {
  DEFAULT_PHONE_CODE,
  PhoneInput,
} from "@/components/forms/phoneInput";

interface RegisterFormProps {
  invitedEmail?: string;
}

export default function RegisterForm({
  invitedEmail: invitedEmailProp,
}: RegisterFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationEmailFromQuery = searchParams.get("email")?.trim() ?? "";
  const invitedEmail = invitedEmailProp ?? invitationEmailFromQuery;
  const isInvitationFlow = invitedEmail.length > 0;
  const [isLoading, setIsLoading] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
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
      toast.error("Debes aceptar las condiciones de uso");
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
          "Hubo un error al crear tu cuenta. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Regístrate</h2>
        {isInvitationFlow ? (
          <p className="mt-3 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Te invitaron a unirte al equipo. Crea tu cuenta para continuar.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <GoogleLogin disabled={isLoading} />
        <AppleLogin disabled={isLoading} />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-400">o</span>
        </div>
      </div>

      <form
        id="register-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="register-name" className="mb-1 block text-gray-700">
              Nombre *
            </Label>
            <Input
              id="register-name"
              type="text"
              placeholder="Nombre"
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
              Apellidos *
            </Label>
            <Input
              id="register-last_name"
              type="text"
              placeholder="Apellidos"
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
            Email *
          </Label>
          <Input
            id="register-email"
            type="email"
            placeholder="Email *"
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
          <Label className="mb-1 block text-gray-700">Teléfono *</Label>
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
                  nationalNumberLabel="Número de teléfono"
                  nationalNumberPlaceholder="Número de móvil"
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
            Contraseña *
          </Label>
          <PasswordInput
            id="register-password"
            placeholder="Contraseña *"
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
          <Label htmlFor="accept-terms" className="text-gray-600">
            Acepto las condiciones de uso y la información básica de protección
            de datos.
          </Label>
        </div>
      </form>

      <Button
        type="submit"
        form="register-form"
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "Creando cuenta..." : "Crear cuenta"}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <a
            href="/iniciar-sesion"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Iniciar sesión
          </a>
        </p>
      </div>
    </>
  );
}
