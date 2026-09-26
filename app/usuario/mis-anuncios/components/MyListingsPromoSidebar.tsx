"use client";

import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { useFeatureListingAction } from "../hooks/useMyListingMutations";
import { OfferCard } from "./offerCard";

export const MyListingsPromoSidebar = () => {
  const {
    purchaseFeaturedCredit,
    featureOffers,
    availableFeaturedCredits,
    isFeaturing,
  } = useFeatureListingAction();

  const handleFeatureClick = async (offerId: string) => {
    if (featureOffers.length === 0) {
      toast.error("No hay ofertas de destacado disponibles.");
      return;
    }

    try {
      await purchaseFeaturedCredit(offerId);
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
          <ul
            className="space-y-3"
            aria-label="Ofertas para comprar cupón de destacado"
          >
            {featureOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isFeatureLoading={isFeaturing}
                handleFeatureClick={handleFeatureClick}
                ctaLabel="Destacar anuncio"
              />
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-xs text-gray-500">
            No hay ofertas de destacado disponibles ahora mismo.
          </p>
        )}

        <span className="mt-2 flex items-center justify-center text-center text-xs text-gray-500">
          <ShieldCheck className="size-4 text-primary" />
          Pago seguro. El cupón se canjea en el anuncio que elijas.
        </span>
      </div>
    </aside>
  );
};
