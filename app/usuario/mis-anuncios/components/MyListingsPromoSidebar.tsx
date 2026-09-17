"use client";

import { toast } from "sonner";
import { RefreshCw, ShieldCheck } from "lucide-react";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { useFeatureListingAction } from "../hooks/useMyListingMutations";
import { OfferCard } from "./offerCard";

interface MyListingsPromoSidebarProps {
  listings: OwnerVehicleListItem[];
}

export const MyListingsPromoSidebar = ({
  listings,
}: MyListingsPromoSidebarProps) => {
  const {
    featureListing,
    featureOffers,
    isFeaturing,
  } = useFeatureListingAction();

  const firstFeatureableListing = listings.find(
    (listing) => listing.can_feature,
  );

  const handleFeatureClick = async (offerId: string) => {
    if (!firstFeatureableListing) {
      return;
    }

    try {
      await featureListing(firstFeatureableListing.id, offerId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo iniciar el checkout de destacado";
      toast.error(message);
    }
  };

  return (
    <aside className="space-y-4">
      <div>
        {featureOffers.length > 0 ? (
          <ul className="space-y-3" aria-label="Ofertas para destacar anuncio">
            {featureOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isFeatureLoading={isFeaturing}
                handleFeatureClick={handleFeatureClick}
              />
            ))}
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
        <span className="mt-2 flex items-center justify-center text-center text-xs text-gray-500">
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
