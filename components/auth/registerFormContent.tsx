"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUser } from "@/app/contexts/auth/useUser";
import { AuthSocialLogins } from "@/app/(auth)/components/AuthSocialLogins";
import { AUTENTICACION_DEFAULT } from "@/app/(auth)/content/autenticacion.fallback";
import { StrapiAviso } from "@/components/strapi/StrapiAviso";
import { StrapiEncabezado } from "@/components/strapi/StrapiEncabezado";
import { StrapiInlineBlocks } from "@/components/strapi/StrapiInlineBlocks";
import { StrapiTextoEnlace } from "@/components/strapi/StrapiTextoEnlace";
import { ReferralCaptureOnMount } from "@/components/referrals/ReferralCaptureOnMount";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/passwordInput";
import { isValidReturnPath } from "@/lib/auth/authReturnTo";
import { trackCompleteRegistration } from "@/lib/analytics/events";
import {
  isMarkedPublishFlow,
  isPublishFlowPath,
  markPublishFlowAuth,
  trackPublishFlowAuth,
} from "@/lib/analytics/publishFlowAuth";
import {
  consumePendingReferralCode,
  persistPendingReferralCode,
  savePostRegisterReferralCode,
} from "@/lib/referrals/referralStorage";
import type {
  StrapiAuthCompartido,
  StrapiAuthRegistro,
} from "@/interfaces/strapi-components.interface";
import {
  buildPendingVehicleRegisterPayload,
  clearPendingVehicleHandoff,
} from "@/components/vehicles/quick-publish/buildPendingVehicleRegisterPayload";
import {
  isQuickPublishHandoffValid,
  useQuickPublishHandoffStore,
} from "@/components/vehicles/quick-publish/stores/quickPublishHandoffStore";
import { authService } from "@/services/authService";
import {
  createRegisterSchema,
  type PendingVehiclePayload,
  RegisterFormValues,
} from "@/validations/Schemas";

interface RegisterFormContentProps {
  content?: StrapiAuthRegistro;
  compartido?: StrapiAuthCompartido;
  invitedEmail?: string;
  referralCodeFromQuery?: string;
  redirectFromQuery?: string | null;
  returnTo?: string;
  showTitle?: boolean;
  showFooterLink?: boolean;
  onSwitchToLogin?: () => void;
  onRegisterSuccess?: () => void | Promise<void>;
  /** Anuncio del invitado: se envía con el registro al publicar. */
  pendingVehiclePayload?: PendingVehiclePayload;
  /** El backend guardó el anuncio: el handoff local ya no hace falta. */
  onPendingVehicleCreated?: () => void;
}

const MIS_ANUNCIOS_PATH = "/usuario/mis-anuncios";

const REGISTER_PLACEHOLDERS = {
  name: "Ej. María",
  email: "tu@correo.com",
  password: "Mínimo 6 caracteres",
} as const;

/** Evita placeholders que solo repiten el label del CMS. */
const resolvePlaceholder = (
  fromCms: string | null | undefined,
  label: string | null | undefined,
  fallback: string,
): string => {
  const value = fromCms?.trim();
  if (!value || value === label?.trim()) {
    return fallback;
  }
  return value;
};

export const RegisterFormContent = ({
  content = AUTENTICACION_DEFAULT.registro as StrapiAuthRegistro,
  compartido = AUTENTICACION_DEFAULT.compartido as StrapiAuthCompartido,
  invitedEmail = "",
  referralCodeFromQuery = "",
  redirectFromQuery = null,
  returnTo,
  showTitle = true,
  showFooterLink = true,
  onSwitchToLogin,
  onRegisterSuccess,
  pendingVehiclePayload,
  onPendingVehicleCreated,
}: RegisterFormContentProps) => {
  const router = useRouter();
  const { refreshUser } = useUser();
  const isInvitationFlow = invitedEmail.length > 0;
  const hasPendingListingHandoff = useQuickPublishHandoffStore((state) =>
    isQuickPublishHandoffValid(state),
  );
  const willAttachListing =
    Boolean(pendingVehiclePayload) || hasPendingListingHandoff;
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const schema = useMemo(() => createRegisterSchema(content), [content]);

  const resolvedRedirect = useMemo(() => {
    const candidates = [redirectFromQuery, returnTo];
    for (const candidate of candidates) {
      if (candidate && isValidReturnPath(candidate)) {
        return candidate;
      }
    }
    return null;
  }, [redirectFromQuery, returnTo]);

  const isPublishListingContext = useMemo(
    () =>
      willAttachListing ||
      isPublishFlowPath(resolvedRedirect) ||
      isPublishFlowPath(returnTo) ||
      isMarkedPublishFlow(),
    [willAttachListing, resolvedRedirect, returnTo],
  );

  useEffect(() => {
    if (referralCodeFromQuery) {
      persistPendingReferralCode(referralCodeFromQuery);
    }
  }, [referralCodeFromQuery]);

  useEffect(() => {
    if (isPublishFlowPath(returnTo)) {
      markPublishFlowAuth();
    }
  }, [returnTo]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: invitedEmail,
      password: "",
      name: "",
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
      const pendingReferralCode =
        consumePendingReferralCode() ?? referralCodeFromQuery;

      const pendingVehicle = buildPendingVehicleRegisterPayload(
        pendingVehiclePayload,
      );

      const response = await authService.register({
        email: data.email,
        password: data.password,
        name: data.name,
        ...(pendingReferralCode
          ? { referral_code: pendingReferralCode }
          : {}),
        ...(pendingVehicle ? { pending_vehicle: pendingVehicle } : {}),
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.referral_code) {
        savePostRegisterReferralCode(response.referral_code);
      }
      if (isPublishFlowPath(resolvedRedirect) || isMarkedPublishFlow()) {
        void trackPublishFlowAuth({ method: "email", isNewUser: true });
      } else {
        trackCompleteRegistration("email");
      }

      const listingAttached =
        Boolean(response.pending_vehicle_id) ||
        Boolean(response.pending_vehicle_queued);

      if (listingAttached && isPublishListingContext) {
        clearPendingVehicleHandoff();
        onPendingVehicleCreated?.();
      }

      await refreshUser();

      if (listingAttached && isPublishListingContext) {
        toast.success(
          response.pending_vehicle_id
            ? "Tu anuncio ya está publicado. Te hemos enviado un correo para verificar tu cuenta."
            : "Cuenta creada. Revisa tu correo para verificar tu dirección de email.",
        );
        if (onRegisterSuccess) {
          await onRegisterSuccess();
        }
        router.push(MIS_ANUNCIOS_PATH);
        router.refresh();
        return;
      }

      if (response.pending_vehicle_error) {
        toast.warning(
          `Tu cuenta se ha creado, pero no hemos podido guardar el anuncio: ${response.pending_vehicle_error.replace(/\.$/, "")}. Podrás publicarlo desde mis anuncios.`,
        );
      }

      toast.success(
        content.mensajes?.exito ||
          "Cuenta creada. Revisa tu correo para verificar tu dirección de email.",
      );

      if (onRegisterSuccess) {
        await onRegisterSuccess();
        return;
      }

      router.push(resolvedRedirect ?? "/");
      router.refresh();
    } catch (error: Error | unknown) {
      console.error("Register error:", error);
      const isTimeout =
        error instanceof DOMException &&
        (error.name === "TimeoutError" || error.name === "AbortError");
      toast.error(
        isTimeout
          ? "El registro está tardando demasiado. Si el correo ya existe, revisa tu bandeja: la cuenta puede haberse creado."
          : (error as Error).message ||
              content.mensajes?.error_generico ||
              "Hubo un error al crear tu cuenta. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-4">
      {showTitle ? (
        <div className="text-center">
          <StrapiEncabezado content={content.encabezado} />
          {isInvitationFlow ? (
            <StrapiAviso content={content.aviso_invitacion} className="mt-3" />
          ) : null}
        </div>
      ) : null}

      <AuthSocialLogins content={compartido} disabled={isLoading} />

      <form
        id="register-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div>
          <Label htmlFor="register-name" className="mb-1 block text-gray-700">
            {content.nombre?.label} *
          </Label>
          <Input
            id="register-name"
            type="text"
            placeholder={resolvePlaceholder(
              content.nombre?.placeholder,
              content.nombre?.label,
              REGISTER_PLACEHOLDERS.name,
            )}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            {...form.register("name")}
            disabled={isLoading}
          />
          {form.formState.errors.name ? (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.name.message}
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="register-email" className="mb-1 block text-gray-700">
            {content.email?.label} *
          </Label>
          <Input
            id="register-email"
            type="email"
            placeholder={resolvePlaceholder(
              content.email?.placeholder,
              content.email?.label,
              REGISTER_PLACEHOLDERS.email,
            )}
            readOnly={isInvitationFlow}
            aria-readonly={isInvitationFlow}
            className={isInvitationFlow ? "bg-gray-50" : undefined}
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
          <Label
            htmlFor="register-password"
            className="mb-1 block text-gray-700"
          >
            {content.contrasena?.label} *
          </Label>
          <PasswordInput
            id="register-password"
            placeholder={resolvePlaceholder(
              content.contrasena?.placeholder,
              content.contrasena?.label,
              REGISTER_PLACEHOLDERS.password,
            )}
            {...form.register("password")}
            disabled={isLoading}
          />
          {form.formState.errors.password ? (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="accept-terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked === true)}
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

      {showFooterLink ? (
        <StrapiTextoEnlace content={content.pie} />
      ) : onSwitchToLogin && content.pie ? (
        <p className="text-center text-sm text-gray-600">
          {content.pie.texto}
          {content.pie.texto && content.pie.enlace ? " " : null}
          {content.pie.enlace ? (
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 font-medium text-blue-600 hover:text-blue-700"
              onClick={onSwitchToLogin}
            >
              {content.pie.enlace.label}
            </Button>
          ) : null}
        </p>
      ) : null}
    </div>
  );
};

interface RegisterFormContentWithRefProps
  extends Omit<RegisterFormContentProps, "referralCodeFromQuery"> {}

/** Lee `ref` de la URL; requiere `<Suspense>`. */
export const RegisterFormContentWithRef = (
  props: RegisterFormContentWithRefProps,
) => {
  const searchParams = useSearchParams();
  const referralFromQuery = searchParams.get("ref")?.trim() ?? "";

  return (
    <>
      <ReferralCaptureOnMount />
      <RegisterFormContent
        {...props}
        referralCodeFromQuery={referralFromQuery}
      />
    </>
  );
};
