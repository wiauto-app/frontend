"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { TwoFactorLoginStep } from "@/app/(auth)/components/TwoFactorLoginStep";
import type { StrapiAuthLogin } from "@/interfaces/strapi-components.interface";
import type { AuthPantallaProps } from "@/app/(auth)/types/strapi-autenticacion.types";
import { useUser } from "@/app/contexts/auth/useUser";
import { AUTH_ROUTES } from "@/constants/auth.constants";
import { authService } from "@/services/authService";

interface TwoFactorVerificationViewProps
  extends AuthPantallaProps<"verificacion_2fa"> {
  /** Toast de sesión iniciada (`auth.login.mensajes.exito`). */
  mensajesLogin: StrapiAuthLogin["mensajes"];
}

/** Paso 2FA de `/verificacion-2fa`: carga el reto pendiente o vuelve al login. */
export const TwoFactorVerificationView = ({
  content,
  mensajesLogin,
}: TwoFactorVerificationViewProps) => {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const response = await authService.getTwoFactorChallenge();

        if (!response.ok || response.data?.type !== "2fa_required") {
          router.replace(AUTH_ROUTES.LOGIN);
          return;
        }

        setEmail(response.data.email);
      } catch {
        router.replace(AUTH_ROUTES.LOGIN);
      } finally {
        setIsLoading(false);
      }
    };

    void loadChallenge();
  }, [router]);

  const handleSuccess = async () => {
    await refreshUser();
    toast.success(mensajesLogin?.exito);
    router.replace("/");
    router.refresh();
  };

  const handleBack = async () => {
    router.replace(AUTH_ROUTES.LOGIN);
  };

  if (isLoading) {
    return (
      <p className="text-center text-sm text-gray-600">
        {content.texto_cargando}
      </p>
    );
  }

  return (
    <TwoFactorLoginStep
      content={content}
      email={email}
      onSuccess={handleSuccess}
      onBack={handleBack}
    />
  );
};
