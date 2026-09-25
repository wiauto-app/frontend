"use client";

import Link from "next/link";
import { toast } from "sonner";
import { AlertTriangle, Loader2, ShieldCheck, Star, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { VehicleInsightsFeatured } from "@/interfaces/vehicle-insights.interface";
import {
  useFeatureListingAction,
  type UseFeatureListingActionOptions,
} from "../hooks/useFeaturedListing";
import { buildEditHref } from "../utils/buildEditHref";
import { formatShortDate } from "../utils/listing-insights-format";
import { OfferCard } from "./OfferCard";

interface FeaturedOffersSectionProps extends UseFeatureListingActionOptions {
  vehicleId: string;
  /**
   * Estado del destacado según los insights. Si no se conoce (insights no
   * disponibles) se muestran las ofertas sin recomendación.
   */
  featured?: VehicleInsightsFeatured | null;
  /** Destino del CTA "Ajustar precio" cuando se recomienda arreglar primero. */
  adjustPriceHref?: string;
  onNavigate?: () => void;
}

export const FeaturedOffersSection = ({
  vehicleId,
  featured,
  adjustPriceHref,
  onNavigate,
  successPath,
  cancelPath,
}: FeaturedOffersSectionProps) => {
  const {
    featureListing,
    featureOffers,
    canFeatureIncluded,
    availableFeaturedCredits,
    isFeaturing,
    isOptionsLoading,
    featuringOfferId,
  } = useFeatureListingAction({ successPath, cancelPath });

  if (featured?.is_active) {
    return (
      <Card size="sm">
        <CardContent className="flex items-start gap-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
            aria-hidden
          >
            <Star className="size-4 fill-current" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Tu anuncio está destacado
            </h2>
            <p className="text-sm text-muted-foreground">
              {featured.expires_at
                ? `Destacado hasta ${formatShortDate(featured.expires_at)}.`
                : "Aparece en las primeras posiciones de búsqueda."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (featured && !featured.can_feature) {
    return null;
  }

  const isFixFirst = featured?.recommendation === "fix_first";
  const resolvedAdjustPriceHref =
    adjustPriceHref ?? buildEditHref(vehicleId, "price");
  const hasFreeOption = canFeatureIncluded || availableFeaturedCredits > 0;

  const handleFeature = async (offerId?: string) => {
    const usesFreeOption = !offerId && hasFreeOption;
    try {
      await featureListing(vehicleId, offerId);
      if (usesFreeOption) {
        toast.success("Anuncio destacado correctamente");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo destacar el anuncio",
      );
    }
  };

  return (
    <section aria-labelledby="destacar-anuncio-title" className="space-y-3">
      <div>
        <h2
          id="destacar-anuncio-title"
          className="text-sm font-semibold text-foreground"
        >
          Destaca tu anuncio
        </h2>
        <p className="text-xs text-muted-foreground">
          Aparece antes en los resultados y consigue más visitas.
        </p>
      </div>

      {isFixFirst ? (
        <div
          role="note"
          className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>
              {featured?.recommendation_reason ??
                "Te recomendamos mejorar el anuncio antes de destacarlo."}
            </p>
          </div>
          <Button
            size="sm"
            className="self-start"
            nativeButton={false}
            render={<Link href={resolvedAdjustPriceHref} onClick={onNavigate} />}
          >
            Ajustar precio
          </Button>
        </div>
      ) : null}

      {isOptionsLoading ? (
        <div className="space-y-2" aria-busy="true" aria-live="polite">
          <span className="sr-only">Cargando opciones de destacado…</span>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : hasFreeOption ? (
        <Button
          type="button"
          variant={isFixFirst ? "outline" : "default"}
          className="w-full"
          disabled={isFeaturing}
          onClick={() => void handleFeature()}
        >
          {isFeaturing ? (
            <Loader2 className="animate-spin" aria-hidden />
          ) : canFeatureIncluded ? (
            <Star className="fill-current" aria-hidden />
          ) : (
            <Ticket aria-hidden />
          )}
          {canFeatureIncluded
            ? "Destacar gratis con tu plan"
            : `Usar un cupón (${availableFeaturedCredits} disponible${availableFeaturedCredits === 1 ? "" : "s"})`}
        </Button>
      ) : featureOffers.length > 0 ? (
        <>
          <ul className="space-y-3" aria-label="Ofertas para destacar este anuncio">
            {featureOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                muted={isFixFirst}
                isFeatureLoading={
                  isFeaturing && (featuringOfferId === null || featuringOfferId === offer.id)
                }
                handleFeatureClick={(offerId) => void handleFeature(offerId)}
              />
            ))}
          </ul>
          <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" aria-hidden />
            Pago seguro con Stripe.
          </p>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">
          No hay ofertas de destacado disponibles ahora mismo.
        </p>
      )}
    </section>
  );
};
