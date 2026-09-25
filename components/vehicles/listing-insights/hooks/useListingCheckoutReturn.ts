"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { trackPendingPurchase } from "@/lib/analytics/events";
import { FEATURED_POLL_TIMEOUT_MS } from "./useVehicleInsights";

export type ListingCheckoutStatus = "success" | "cancel";

/**
 * Estado del destacado según los insights:
 * - `active` / `inactive`: conocido.
 * - `unknown`: los insights fallaron, no se puede confirmar la activación.
 */
export type FeaturedActivationStatus = "active" | "inactive" | "unknown";

interface UseListingCheckoutReturnOptions {
  checkoutStatus: ListingCheckoutStatus | null;
  featuredStatus: FeaturedActivationStatus;
  /** Ruta sin `?checkout=` a la que se vuelve tras gestionar el retorno. */
  basePath: string;
}

/**
 * Retorno de Stripe: avisa al usuario, espera al webhook (si se conoce el
 * estado del destacado) y limpia `?checkout=` de la URL.
 */
export const useListingCheckoutReturn = ({
  checkoutStatus,
  featuredStatus,
  basePath,
}: UseListingCheckoutReturnOptions) => {
  const router = useRouter();
  const handledCheckoutRef = useRef(false);

  useEffect(() => {
    if (!checkoutStatus || handledCheckoutRef.current) {
      return;
    }

    const stripCheckoutParam = () => {
      handledCheckoutRef.current = true;
      router.replace(basePath, { scroll: false });
    };

    if (checkoutStatus === "cancel") {
      toast.error("El pago fue cancelado");
      stripCheckoutParam();
      return;
    }

    if (featuredStatus === "active") {
      toast.success("¡Listo! Tu anuncio ya está destacado");
      stripCheckoutParam();
      return;
    }

    const notifyPending = () => {
      toast.info(
        "El pago se ha recibido. El destacado puede tardar unos minutos en activarse.",
      );
      stripCheckoutParam();
    };

    // Sin insights no podemos confirmar la activación: avisar ya.
    if (featuredStatus === "unknown") {
      notifyPending();
      return;
    }

    const timeout = window.setTimeout(notifyPending, FEATURED_POLL_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [checkoutStatus, featuredStatus, basePath, router]);

  // Se registra la compra una sola vez al volver de Stripe con éxito.
  useEffect(() => {
    if (checkoutStatus !== "success") {
      return;
    }
    trackPendingPurchase();
    toast.success("Pago completado. Activando el destacado…");
  }, [checkoutStatus]);
};
