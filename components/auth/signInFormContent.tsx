"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginAction } from "@/app/(auth)/authActions/authActions";
import { TwoFactorLoginStep } from "@/app/(auth)/components/TwoFactorLoginStep";
import { AuthSocialLogins } from "@/app/(auth)/components/AuthSocialLogins";
import { AUTENTICACION_DEFAULT } from "@/app/(auth)/content/autenticacion.fallback";
import { StrapiEncabezado } from "@/components/strapi/StrapiEncabezado";
import { StrapiInlineBlocks } from "@/components/strapi/StrapiInlineBlocks";
import { StrapiTextoEnlace } from "@/components/strapi/StrapiTextoEnlace";
import type {
  StrapiAuthCompartido,
  StrapiAuthLogin,
  StrapiAuthVerificacion2fa,
} from "@/interfaces/strapi-components.interface";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";
import { createLoginSchema, LoginDto } from "@/validations/Schemas";
import { PasswordInput } from "../ui/passwordInput";

interface SignInFormContentProps {
  onSuccess: () => void | Promise<void>;
  showTitle?: boolean;
  showSocialLogins?: boolean;
  className?: string;
  returnTo?: string;
  /** Textos de `auth.login`; sin ellos (p. ej. en el modal) se usan los de respaldo. */
  content?: StrapiAuthLogin;
  compartido?: StrapiAuthCompartido;
  /** Textos del paso 2FA que aparece tras las credenciales. */
  contentVerificacion?: StrapiAuthVerificacion2fa;
}

type SignInStep = "credentials" | "two_factor";

export const SignInFormContent = ({
  onSuccess,
  showTitle = true,
  showSocialLogins = true,
  className,
  returnTo,
  content = AUTENTICACION_DEFAULT.login as StrapiAuthLogin,
  compartido = AUTENTICACION_DEFAULT.compartido as StrapiAuthCompartido,
  contentVerificacion,
}: SignInFormContentProps) => {
  const router = useRouter();
  const formId = useId();
  const [step, setStep] = useState<SignInStep>("credentials");
  const [pendingEmail, setPendingEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const schema = useMemo(() => createLoginSchema(content), [content]);
  const form = useForm<LoginDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const resumePendingChallenge = async () => {
      try {
        const response = await authService.getTwoFactorChallenge();
        if (response.ok && response.data?.type === "2fa_required") {
          setPendingEmail(response.data.email);
          setStep("two_factor");
        }
      } catch {
        // Sin reto 2FA pendiente.
      }
    };

    void resumePendingChallenge();
  }, []);

  const handleSubmit = async (data: LoginDto) => {
    setIsLoading(true);

    try {
      const response = await authService.login(data);
      if (!response.ok) {
        toast.error(response.message || content.mensajes?.error_generico);
        return;
      }
      if (response.data.type === "2fa_challenge") {
        setPendingEmail(data.email);
        setStep("two_factor");
        return;
      }
      if(returnTo) {
        router.push(returnTo);
      }
      await onSuccess();
    } catch (error: Error | unknown) {
      console.error("Login error:", error);

      toast.error(
        (error as Error).message || content.mensajes?.error_generico,
      );
    } finally { 
      setIsLoading(false);
    }
  };

  const handleBackToCredentials = async () => {
    setStep("credentials");
    setPendingEmail("");
  };

  if (step === "two_factor") {
    return (
      <div className={cn("w-full space-y-8", className)}>
        <TwoFactorLoginStep
          content={contentVerificacion}
          email={pendingEmail}
          onSuccess={async () => {
            await onSuccess();
            router.push(returnTo ?? "/");
          }}
          onBack={handleBackToCredentials}
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {showTitle ? <StrapiEncabezado content={content.encabezado} /> : null}

      {showSocialLogins ? (
        <AuthSocialLogins
          content={compartido}
          disabled={isLoading}
          returnTo={returnTo}
        />
      ) : null}

      <form
        id={formId}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <div>
          <label
            htmlFor={`${formId}-email`}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {content.email?.label} *
          </label>
          <Input
            id={`${formId}-email`}
            type="email"
            placeholder={content.email?.placeholder ?? undefined}
            autoComplete="email"
            {...form.register("email")}
            disabled={isLoading}
          />
          {form.formState.errors.email ? (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={`${formId}-password`}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {content.contrasena?.label} *
          </label>
          <PasswordInput
            id={`${formId}-password`}
            placeholder={content.contrasena?.placeholder ?? undefined}
            autoComplete="current-password"
            {...form.register("password")}
            disabled={isLoading}
          />
          {form.formState.errors.password ? (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="flex items-center">
          <Checkbox
            id={`${formId}-keep-logged-in`}
            checked={keepLoggedIn}
            onCheckedChange={(checked) => setKeepLoggedIn(checked === true)}
            disabled={isLoading}
          />
          <label
            htmlFor={`${formId}-keep-logged-in`}
            className="ml-2 block text-sm text-gray-700"
          >
            <StrapiInlineBlocks content={content.recordar_sesion?.texto ?? null} />
          </label>
        </div>
      </form>

      <Button
        type="submit"
        form={formId}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading
          ? content.boton?.label_cargando || content.boton?.label
          : content.boton?.label}
      </Button>

      <div className="space-y-2 text-center">
        <StrapiTextoEnlace content={content.pie} />
        {content.enlace_olvide_contrasena ? (
          <Button
            type="button"
            variant="link"
            className="text-blue-600 hover:text-blue-700"
            nativeButton={false}
            render={<Link href={content.enlace_olvide_contrasena.url} />}
          >
            {content.enlace_olvide_contrasena.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
