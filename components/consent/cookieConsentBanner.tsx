"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CookieIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
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

  const isSheetOpen = isBannerVisible || isPreferencesOpen;

  useEffect(() => {
    if (isPreferencesOpen) {
      setDraft(preferences ?? { analytics: false, marketing: false });
    }
  }, [isPreferencesOpen, preferences]);

  const handleOpenChange = (
    open: boolean,
    eventDetails: { cancel: () => void },
  ) => {
    if (open) {
      return;
    }

    if (isBannerVisible) {
      eventDetails.cancel();
      if (isPreferencesOpen) {
        closePreferences();
      }
      return;
    }

    closePreferences();
  };

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={handleOpenChange}
      modal={false}
      disablePointerDismissal
    >
      <SheetContent
        side="bottom"
        showCloseButton={!isBannerVisible}
        showOverlay={false}
        initialFocus={false}
        className="gap-0 px-4 py-4 bottom-20! md:bottom-0!"
      >
        <div className="container-custom mx-auto">
          {isPreferencesOpen ? (
            <>
              <SheetHeader className="px-0 pt-0">
                {isBannerVisible ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={closePreferences}
                    className="mb-1 w-fit px-0"
                    aria-label="Volver al aviso de cookies"
                  >
                    <ArrowLeft className="size-4" />
                    Volver
                  </Button>
                ) : null}
                <SheetTitle>Preferencias de cookies</SheetTitle>
                <SheetDescription>
                  Elige qué cookies quieres permitir. Puedes cambiar tu decisión
                  cuando quieras.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Necesarias</p>
                    <p className="text-xs text-muted-foreground">
                      Imprescindibles para iniciar sesión y usar la web. No se
                      pueden desactivar.
                    </p>
                  </div>
                  <Switch checked disabled aria-label="Cookies necesarias" />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Label
                      htmlFor="consent-analytics"
                      className="text-sm font-medium"
                    >
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
                      setDraft((current) => ({
                        ...current,
                        analytics: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Label
                      htmlFor="consent-marketing"
                      className="text-sm font-medium"
                    >
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
                      setDraft((current) => ({
                        ...current,
                        marketing: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <SheetFooter className="flex-col gap-2 px-0 sm:flex-row">
                <Button variant="outline" onClick={rejectAll}>
                  Rechazar todas
                </Button>
                <Button onClick={() => savePreferences(draft)}>
                  Guardar preferencias
                </Button>
              </SheetFooter>
            </>
          ) : (
            <>
              <SheetHeader className="px-0 pt-0 text-left">
                <SheetTitle className="flex items-center gap-2 text-base">
                  <CookieIcon
                    className="size-5 shrink-0 text-primary"
                    aria-hidden
                  />
                  Aviso de cookies
                </SheetTitle>
                <SheetDescription className="text-pretty">
                  Usamos cookies propias y de terceros para medir el uso de la
                  web y mostrarte publicidad personalizada. Puedes aceptarlas
                  todas, rechazarlas o elegir cuáles permites. Consulta nuestra{" "}
                  <Link
                    href="/cookies"
                    className="font-medium text-primary underline underline-offset-2"
                  >
                    política de cookies
                  </Link>
                  .
                </SheetDescription>
              </SheetHeader>

              <SheetFooter className="flex-col gap-2 px-0 pt-4 sm:flex-row">
                <Button variant="ghost" onClick={openPreferences}>
                  Configurar
                </Button>
                <Button variant="outline" onClick={rejectAll}>
                  Rechazar todas
                </Button>
                <Button onClick={acceptAll}>Aceptar todas</Button>
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
