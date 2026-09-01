"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CookieIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { ConsentPreferences } from "@/lib/analytics/consent";

import { useCookieConsent } from "./cookieConsentProvider";

export const CookieConsentBanner = () => {
  const {
    preferences,
    isBannerVisible,
    isPreferencesOpen,
    openPreferences,
    closePreferences,
    acceptAll,
    rejectAll,
    savePreferences,
  } = useCookieConsent();

  const [draft, setDraft] = useState<ConsentPreferences>({
    analytics: false,
    marketing: false,
  });

  // Al abrir el panel partimos de lo que el usuario tenga guardado.
  useEffect(() => {
    if (isPreferencesOpen) {
      setDraft(preferences ?? { analytics: false, marketing: false });
    }
  }, [isPreferencesOpen, preferences]);

  return (
    <>
      {isBannerVisible ? (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Aviso de cookies"
          className="fixed inset-x-0 bottom-0 z-100 border-t bg-background/95 p-4 pb-8 shadow-lg backdrop-blur md:pb-4"
        >
          <div className="container-custom mx-auto flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <CookieIcon
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden
              />
              <p className="text-pretty text-sm text-muted-foreground">
                Usamos cookies propias y de terceros para medir el uso de la web
                y mostrarte publicidad personalizada. Puedes aceptarlas todas,
                rechazarlas o elegir cuáles permites. Consulta nuestra{" "}
                <Link
                  href="/cookies"
                  className="font-medium text-primary underline underline-offset-2"
                >
                  política de cookies
                </Link>
                .
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button variant="ghost" onClick={openPreferences}>
                Configurar
              </Button>
              <Button variant="outline" onClick={rejectAll}>
                Rechazar todas
              </Button>
              <Button onClick={acceptAll}>Aceptar todas</Button>
            </div>
          </div>
        </div>
      ) : null}

      <Dialog
        open={isPreferencesOpen}
        onOpenChange={(open) => {
          if (!open) {
            closePreferences();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preferencias de cookies</DialogTitle>
            <DialogDescription>
              Elige qué cookies quieres permitir. Puedes cambiar tu decisión
              cuando quieras.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">Necesarias</p>
                <p className="text-xs text-muted-foreground">
                  Imprescindibles para iniciar sesión y usar la web. No se
                  pueden desactivar.
                </p>
              </div>
              <Switch checked disabled aria-label="Cookies necesarias" />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Label htmlFor="consent-analytics" className="text-sm font-medium">
                  Analíticas
                </Label>
                <p className="text-xs text-muted-foreground">
                  Nos permiten saber cómo se usa la web para mejorarla.
                </p>
              </div>
              <Switch
                id="consent-analytics"
                checked={draft.analytics}
                onCheckedChange={(checked) =>
                  setDraft((current) => ({ ...current, analytics: checked }))
                }
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Label htmlFor="consent-marketing" className="text-sm font-medium">
                  Publicidad
                </Label>
                <p className="text-xs text-muted-foreground">
                  Se usan para mostrarte anuncios relevantes y medir su
                  rendimiento.
                </p>
              </div>
              <Switch
                id="consent-marketing"
                checked={draft.marketing}
                onCheckedChange={(checked) =>
                  setDraft((current) => ({ ...current, marketing: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={rejectAll}>
              Rechazar todas
            </Button>
            <Button onClick={() => savePreferences(draft)}>
              Guardar preferencias
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
