"use client";

import { RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";

type MyListingsPromoSidebarProps = {
  listings: OwnerVehicleListItem[];
  featurePlan: BillingCatalogPlan | null;
  onFeature: (id: string) => Promise<void>;
  isFeatureLoading?: boolean;
};

const formatEuros = (amount_cents: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount_cents / 100);

export const MyListingsPromoSidebar = ({
  listings,
  featurePlan,
  onFeature,
  isFeatureLoading = false,
}: MyListingsPromoSidebarProps) => {
  const firstFeatureableListing = listings.find((listing) => listing.can_feature);
  const featurePrice = featurePlan?.prices[0];

  const handleFeatureClick = async () => {
    if (!firstFeatureableListing) {
      return;
    }

    await onFeature(firstFeatureableListing.id);
  };

  return (
    <aside className="space-y-4">
      <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-5">
        <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <Star className="size-5 fill-amber-500 text-amber-500" aria-hidden />
        </div>
        <h2 className="text-base font-semibold text-gray-900">Destaca tu anuncio</h2>
        <p className="mt-2 text-sm text-gray-600">
          Aparece primero en los listados durante 30 días y aumenta la visibilidad
          de tu vehículo frente a compradores activos.
        </p>
        {featurePrice ? (
          <p className="mt-2 text-sm font-medium text-gray-800">
            Desde {formatEuros(featurePrice.amount_cents)}
          </p>
        ) : null}
        <Button
          type="button"
          size="sm"
          className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700"
          disabled={!firstFeatureableListing || isFeatureLoading || !featurePrice}
          onClick={handleFeatureClick}
        >
          <Star className="mr-1.5 size-4 fill-current" aria-hidden />
          Destacar anuncio
        </Button>
        {!firstFeatureableListing ? (
          <p className="mt-2 text-xs text-gray-500">
            No tienes anuncios activos disponibles para destacar.
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
        <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <RefreshCw className="size-5" aria-hidden />
        </div>
        <h2 className="text-base font-semibold text-gray-900">
          ¿Qué significa renovar?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Renovar sube tu anuncio en los resultados de búsqueda sin coste
          adicional. Puedes hacerlo cada 7 días mientras el anuncio esté activo.
        </p>
      </div>
    </aside>
  );
};
