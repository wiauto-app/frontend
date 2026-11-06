"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";

const DISMISS_STORAGE_KEY = "wiauto_email_verification_banner_dismissed";

export const EmailVerificationBanner = () => {
  const { user, isAuthenticated, isAuthResolved } = useUser();
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasHydratedDismiss, setHasHydratedDismiss] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    try {
      setIsDismissed(
        sessionStorage.getItem(DISMISS_STORAGE_KEY) === "1",
      );
    } catch {
      setIsDismissed(false);
    }
    setHasHydratedDismiss(true);
  }, []);

  const handleDismiss = useCallback(() => {
    try {
      sessionStorage.setItem(DISMISS_STORAGE_KEY, "1");
    } catch {
      // sessionStorage no disponible
    }
    setIsDismissed(true);
  }, []);

  const handleResend = async () => {
    if (!user?.email || isResending) {
      return;
    }

    setIsResending(true);
    try {
      const response = await authService.resendEmailVerification(user.email);
      if (!response.ok) {
        toast.error(
          response.message ||
            "No hemos podido reenviar el correo. Inténtalo de nuevo.",
        );
        return;
      }
      toast.success(
        response.message ||
          "Te hemos enviado un nuevo correo de verificación.",
      );
    } catch {
      toast.error("No hemos podido reenviar el correo. Inténtalo de nuevo.");
    } finally {
      setIsResending(false);
    }
  };

  if (
    !hasHydratedDismiss ||
    !isAuthResolved ||
    !isAuthenticated ||
    !user ||
    user.is_email_verified ||
    isDismissed
  ) {
    return null;
  }

  return (
    <div
      className="border-b border-amber-200 bg-amber-50 text-amber-950"
      role="region"
      aria-label="Verificación de correo electrónico pendiente"
    >
      <div className="container-custom mx-auto flex min-h-11 flex-wrap items-center gap-2 px-4 py-2 sm:px-6 lg:px-8">
        <p className="min-w-0 flex-1 text-sm leading-snug">
          Verifica tu correo electrónico para asegurar tu cuenta y recibir
          avisos importantes sobre tus anuncios.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 shrink-0 border-amber-300 bg-white text-amber-950 hover:bg-amber-100"
          onClick={handleResend}
          disabled={isResending}
          aria-busy={isResending}
        >
          {isResending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Enviando…
            </>
          ) : (
            "Reenviar correo"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={handleDismiss}
          aria-label="Ocultar aviso de verificación de correo"
          className="size-8 shrink-0 text-amber-900 hover:bg-amber-100 hover:text-amber-950"
        >
          <X />
        </Button>
      </div>
    </div>
  );
};
