"use client";

import { RefreshCw, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FeaturedListingOffer } from "@/interfaces/billing.interface";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { OfferCard } from "./offerCard";

interface MyListingsPromoSidebarProps {
  listings: OwnerVehicleListItem[];
  featureOffers: FeaturedListingOffer[];
  onFeature: (vehicleId: string, offerId: string) => Promise<void>;
  isFeatureLoading?: boolean;
  featuringOfferId?: string | null;
}

const formatEuros = (amount_cents: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount_cents / 100);

export const MyListingsPromoSidebar = ({
  listings,
  featureOffers,
  onFeature,
  isFeatureLoading = false,
  featuringOfferId = null,
}: MyListingsPromoSidebarProps) => {
  const firstFeatureableListing = listings.find(
    (listing) => listing.can_feature,
  );

  const handleFeatureClick = async (offerId: string) => {
    if (!firstFeatureableListing) {
      return;
    }

    await onFeature(firstFeatureableListing.id, offerId);
  };

  return (
    <aside className="space-y-4">
      <div>
        {featureOffers.length > 0 ? (
          <ul
            className=" space-y-3"
            aria-label="Ofertas para destacar anuncio"
          >
            {featureOffers.map((offer) => {
              return (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  isFeatureLoading={isFeatureLoading}
                  handleFeatureClick={handleFeatureClick}
                />
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 text-xs text-gray-500">
            No hay ofertas de destacado disponibles ahora mismo.
          </p>
        )}

        {!firstFeatureableListing ? (
          <p className="mt-2 text-xs text-gray-500">
            No tienes anuncios activos disponibles para destacar.
          </p>
        ) : null}
        <span className="text-xs text-gray-500 flex items-center text-center justify-center mt-2">
          <ShieldCheck className="size-4 text-primary" />
          Pago seguro. Puedes cancelar cuando quieras.
        </span>
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
