"use client";

import Script from "next/script";
import type { CredentialResponse } from "google-one-tap";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { GOOGLE_CLIENT_ID } from "@/constants/external.constant";
import { authService } from "@/services/authService";

const ONE_TAP_EXCLUDED_PATH_PREFIXES = [
  "/iniciar-sesion",
  "/registro",
  "/verificacion-2fa",
  "/olvide-contrasena",
  "/cambiar-contrasena",
  "/confirmar-correo",
  "/oauth-popup-complete",
  "/usuario",
] as const;

const isOneTapExcludedPath = (pathname: string): boolean =>
  ONE_TAP_EXCLUDED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

const generateNonce = async (): Promise<[string, string]> => {
  const nonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
  );
  const encoder = new TextEncoder();
  const encodedNonce = encoder.encode(nonce);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedNonce = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return [nonce, hashedNonce];
};

export const OneTapSignIn = () => {
  const { isAuthenticated, isLoading, refreshUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const isInitializedRef = useRef(false);
  const rawNonceRef = useRef<string | null>(null);

  const clientId = GOOGLE_CLIENT_ID;
  const isPathExcluded = isOneTapExcludedPath(pathname);
  const shouldRender =
    Boolean(clientId) && !isLoading && !isAuthenticated && !isPathExcluded;

  const cancelOneTap = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const googleAccounts = window.google?.accounts;
    if (googleAccounts?.id) {
      googleAccounts.id.cancel();
    }
    isInitializedRef.current = false;
    rawNonceRef.current = null;
  }, []);

  const handleCredential = useCallback(
    async (response: CredentialResponse) => {
      try {
        console.log("response", response);

        const nonce = rawNonceRef.current;
        if (!nonce || !response.credential) {
          toast.error("No se pudo completar el inicio de sesión con Google");
          return;
        }
        const apiResponse = await authService.googleOneTap({
          id_token: response.credential,
          nonce,
        });

        if (!apiResponse.ok || !apiResponse.data) {
          toast.error(
            apiResponse.message ?? "No se pudo iniciar sesión con Google",
          );
          return;
        }

        if (apiResponse.data.type === "2fa_challenge") {
          router.push("/verificacion-2fa");
          return;
        }

        await refreshUser();
        router.refresh();
      } catch (error) {
        console.error("Error al iniciar sesión con Google One Tap", error);
        toast.error("No se pudo iniciar sesión con Google");
      } finally {
        cancelOneTap();
      }
    },
    [cancelOneTap, refreshUser, router],
  );

  const initializeGoogleOneTap = useCallback(async () => {
    if (!shouldRender || isInitializedRef.current) {
      return;
    }


    const googleAccounts = window.google?.accounts;
    if (typeof window === "undefined" || !googleAccounts?.id) {
      return;
    }

    try {
      const [nonce, hashedNonce] = await generateNonce();
      rawNonceRef.current = nonce;
      googleAccounts.id.initialize({
        client_id: clientId,
        callback: handleCredential,
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: "signin",
      });
      

      googleAccounts.id.prompt();
      isInitializedRef.current = true;
    } catch (error) {
      console.error("Error al inicializar Google One Tap", error);
    }
  }, [clientId, handleCredential, shouldRender]);

  useEffect(() => {
    if (!shouldRender) {
      cancelOneTap();
      return;
    }

    if (!isScriptLoaded) {
      return;
    }

    const timer = window.setTimeout(() => {
      void initializeGoogleOneTap();
    }, 100);

    return () => {
      window.clearTimeout(timer);
      cancelOneTap();
    };
  }, [
    cancelOneTap,
    initializeGoogleOneTap,
    isScriptLoaded,
    shouldRender,
    pathname,
  ]);

  if (!shouldRender) {
    return null;
  }

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  const handleScriptError = () => {
    console.error("Error al cargar el script de Google One Tap");
  };

  return (
    <Script
      id="google-one-tap-script"
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={handleScriptLoad}
      onError={handleScriptError}
    />
  );
};
