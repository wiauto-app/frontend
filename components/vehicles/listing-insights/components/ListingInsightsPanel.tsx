"use client";

import { Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  ListingCheck,
  VehicleInsights,
} from "@/interfaces/vehicle-insights.interface";
import { useVehicleInsights } from "../hooks/useVehicleInsights";
import { VehicleInsightsAccessError } from "../services/vehicleInsightsService";
import {
  useListingCheckoutReturn,
  type FeaturedActivationStatus,
  type ListingCheckoutStatus,
} from "../hooks/useListingCheckoutReturn";
import { buildEditHref } from "../utils/buildEditHref";
import { PRICE_INSIGHT_ANCHOR_ID } from "./PriceInsightCard";
import { FeaturedOffersSection } from "./FeaturedOffersSection";
import {
  DIAGNOSIS_PAGE_GRID_CLASS,
  ListingDiagnosisContent,
  ListingDiagnosisSkeleton,
} from "./ListingDiagnosisContent";

export type { ListingCheckoutStatus } from "../hooks/useListingCheckoutReturn";

interface ListingInsightsPanelProps {
  vehicleId: string;
  /** Insights leídos en servidor; `null` si fallaron (se reintenta en cliente). */
  initialInsights: VehicleInsights | null;
  checkoutStatus: ListingCheckoutStatus | null;
}

const EXITO_PATH = "/publicar/exito";

export const ListingInsightsPanel = ({
  vehicleId,
  initialInsights,
  checkoutStatus,
}: ListingInsightsPanelProps) => {
  const insightsQuery = useVehicleInsights(vehicleId, {
    initialData: initialInsights,
    pollFeaturedActivation: checkoutStatus === "success",
  });
  const insights = insightsQuery.data ?? initialInsights;

  const featuredStatus: FeaturedActivationStatus = insights
    ? insights.featured.is_active
      ? "active"
      : "inactive"
    : insightsQuery.isError
      ? "unknown"
      : "inactive";

  const basePath = `${EXITO_PATH}?id=${encodeURIComponent(vehicleId)}`;
  const successPath = `${basePath}&checkout=success`;
  const cancelPath = `${basePath}&checkout=cancel`;

  useListingCheckoutReturn({ checkoutStatus, featuredStatus, basePath });

  if (!insights) {
    if (
      insightsQuery.isError &&
      insightsQuery.error instanceof VehicleInsightsAccessError
    ) {
      return null;
    }

    if (insightsQuery.isError) {
      return (
        <div className={DIAGNOSIS_PAGE_GRID_CLASS}>
          <InsightsUnavailableNotice
            onRetry={() => void insightsQuery.refetch()}
            isRetrying={insightsQuery.isFetching}
          />
          <FeaturedOffersSection
            vehicleId={vehicleId}
            successPath={successPath}
            cancelPath={cancelPath}
          />
        </div>
      );
    }

    return <ListingDiagnosisSkeleton variant="page" />;
  }

  const hasMarket = insights.price.market !== null;

  // En esta página el precio se ajusta en línea: los CTA de precio llevan a la
  // tarjeta de mercado en lugar de al editor.
  const resolveHref = (check: ListingCheck): string | null => {
    if (!check.cta) {
      return null;
    }
    if (check.cta.target === "price" && hasMarket) {
      return `#${PRICE_INSIGHT_ANCHOR_ID}`;
    }
    return buildEditHref(vehicleId, check.cta.target);
  };

  const adjustPriceHref = hasMarket
    ? `#${PRICE_INSIGHT_ANCHOR_ID}`
    : buildEditHref(vehicleId, "price");

  return (
    <ListingDiagnosisContent
      variant="page"
      insights={insights}
      resolveHref={resolveHref}
      adjustPriceHref={adjustPriceHref}
      successPath={successPath}
      cancelPath={cancelPath}
    />
  );
};

interface InsightsUnavailableNoticeProps {
  onRetry: () => void;
  isRetrying: boolean;
}

const InsightsUnavailableNotice = ({
  onRetry,
  isRetrying,
}: InsightsUnavailableNoticeProps) => (
  <section
    aria-labelledby="diagnostico-no-disponible"
    className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 sm:p-6"
  >
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
      aria-hidden
    >
      <Info className="size-4" />
    </div>
    <div className="space-y-3">
      <div className="space-y-1" role="status">
        <h2
          id="diagnostico-no-disponible"
          className="text-sm font-semibold text-foreground"
        >
          Diagnóstico no disponible
        </h2>
        <p className="text-sm text-muted-foreground">
          No pudimos analizar tu anuncio ahora. Reinténtalo o consúltalo más
          tarde desde Mis anuncios.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRetry}
        disabled={isRetrying}
      >
        <RefreshCw
          className={isRetrying ? "animate-spin motion-reduce:animate-none" : undefined}
          aria-hidden
        />
        Reintentar
      </Button>
    </div>
  </section>
);
