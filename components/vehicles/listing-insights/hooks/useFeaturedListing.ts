"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import type { FeaturedListingOffer } from "@/interfaces/billing.interface";
import { myListingsService } from "@/services/myListings/myListingsService";
import { billingService } from "@/services/billingService";
import { absoluteUrl } from "@/lib/seo/absolute-url";
import { rememberPendingPurchase } from "@/lib/analytics/events";
import { useEntitlements } from "@/hooks/useEntitlements";
import {
  BILLING_ME_QUERY_KEY,
  FEATURED_LISTING_OFFERS_QUERY_KEY,
  MY_LISTINGS_QUERY_KEY,
  VEHICLE_INSIGHTS_QUERY_KEY,
} from "./listing-insights-query-keys";

const DEFAULT_FEATURE_SUCCESS_PATH = "/usuario/mis-anuncios?checkout=success";
const DEFAULT_FEATURE_CANCEL_PATH = "/usuario/mis-anuncios?checkout=cancel";

export interface UseFeatureListingActionOptions {
  /** Ruta relativa a la que Stripe vuelve tras un pago correcto. */
  successPath?: string;
  /** Ruta relativa a la que Stripe vuelve si se cancela el pago. */
  cancelPath?: string;
}

export const useFeaturedListingOffers = (enabled = true) => {
  const featuredOffersQuery = useQuery({
    queryKey: FEATURED_LISTING_OFFERS_QUERY_KEY,
    queryFn: () => billingService.getFeaturedListingOffersCatalog(),
    enabled,
  });

  const featureOffers = useMemo((): FeaturedListingOffer[] => {
    return (featuredOffersQuery.data ?? [])
      .filter((offer) => offer.is_active && offer.stripe_price_id)
      .sort((left, right) => {
        if (left.sort_order !== right.sort_order) {
          return left.sort_order - right.sort_order;
        }
        return left.amount_cents - right.amount_cents;
      });
  }, [featuredOffersQuery.data]);

  return {
    featureOffers,
    featureOffer: featureOffers[0] ?? null,
    isLoading: featuredOffersQuery.isLoading,
  };
};

export const useFeatureListingAction = ({
  successPath = DEFAULT_FEATURE_SUCCESS_PATH,
  cancelPath = DEFAULT_FEATURE_CANCEL_PATH,
}: UseFeatureListingActionOptions = {}) => {
  const queryClient = useQueryClient();
  const { getLimitUsage } = useEntitlements();
  const { featureOffers, featureOffer, isLoading: isOffersLoading } =
    useFeaturedListingOffers();

  const billingMeQuery = useQuery({
    queryKey: BILLING_ME_QUERY_KEY,
    queryFn: () => billingService.getMe(),
  });

  const canFeatureIncluded = getLimitUsage("featured_listings").canUseIncluded;
  const availableFeaturedCredits =
    billingMeQuery.data?.available_featured_credits ?? 0;

  const invalidateAfterFeature = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: MY_LISTINGS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: BILLING_ME_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: VEHICLE_INSIGHTS_QUERY_KEY }),
    ]);
  };

  const featureIncludedMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await myListingsService.feature(id);
      if (!response.ok) {
        throw new Error(response.message || "No se pudo destacar el anuncio");
      }
      return response.data;
    },
    onSuccess: invalidateAfterFeature,
  });

  const redeemFeaturedCreditMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await myListingsService.redeemFeaturedCredit(id);
      if (!response.ok) {
        throw new Error(
          response.message || "No se pudo canjear el cupón de destacado",
        );
      }
      return response.data;
    },
    onSuccess: invalidateAfterFeature,
  });

  const featureCheckoutMutation = useMutation({
    mutationFn: async ({
      vehicleId,
      offerId,
    }: {
      vehicleId?: string;
      offerId: string;
    }) => {
      const checkoutUrl = await billingService.createFeaturedListingCheckout(
        offerId,
        vehicleId,
        {
          success_url: absoluteUrl(successPath),
          cancel_url: absoluteUrl(cancelPath),
        },
      );
      if (!checkoutUrl) {
        throw new Error("No se pudo iniciar el checkout de destacado");
      }

      const offer = featureOffers.find((item) => item.id === offerId);
      if (offer) {
        rememberPendingPurchase({
          value: offer.amount_cents / 100,
          currency: offer.currency.toUpperCase(),
          contentName: offer.title,
          contentIds: [offer.id],
        });
      }

      window.location.assign(checkoutUrl);
    },
  });

  const purchaseFeaturedCredit = async (offerId: string) => {
    return featureCheckoutMutation.mutateAsync({ offerId });
  };

  /**
   * Orden de resolución: oferta forzada → plan incluido → cupón → primera oferta.
   */
  const featureListing = async (vehicleId: string, offerId?: string) => {
    // Si se fuerza una oferta, checkout ligado a ese vehículo (pago directo).
    if (offerId) {
      return featureCheckoutMutation.mutateAsync({
        vehicleId,
        offerId,
      });
    }

    if (canFeatureIncluded) {
      return featureIncludedMutation.mutateAsync(vehicleId);
    }

    if (availableFeaturedCredits > 0) {
      return redeemFeaturedCreditMutation.mutateAsync(vehicleId);
    }

    const selectedOfferId = featureOffer?.id;
    if (!selectedOfferId) {
      throw new Error("No hay ofertas de destacado disponibles");
    }

    return featureCheckoutMutation.mutateAsync({
      vehicleId,
      offerId: selectedOfferId,
    });
  };

  const featurePriceLabel =
    canFeatureIncluded || availableFeaturedCredits > 0 || !featureOffer
      ? null
      : new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: "EUR",
        }).format(featureOffer.amount_cents / 100);

  return {
    featureListing,
    purchaseFeaturedCredit,
    featureOffers,
    featureOffer,
    featurePriceLabel,
    canFeatureIncluded,
    availableFeaturedCredits,
    featureDurationDays: featureOffer?.duration_days ?? null,
    isOptionsLoading: isOffersLoading || billingMeQuery.isLoading,
    isFeaturing:
      featureIncludedMutation.isPending ||
      redeemFeaturedCreditMutation.isPending ||
      featureCheckoutMutation.isPending,
    featuringOfferId: featureCheckoutMutation.variables?.offerId ?? null,
  };
};
