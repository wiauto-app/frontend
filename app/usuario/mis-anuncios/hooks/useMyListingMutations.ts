"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import type { VehicleStatus } from "@/components/vehicles/constants/vehicle-status.constants";
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
} from "./my-listings-query-keys";

const useInvalidateMyListings = () => {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: MY_LISTINGS_QUERY_KEY });
  };
};

const useInvalidateBillingMe = () => {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: BILLING_ME_QUERY_KEY });
  };
};

export const useRemoveListingMutation = () => {
  const invalidateListings = useInvalidateMyListings();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await myListingsService.remove(id);
      if (!response.ok && response.status !== 204) {
        throw new Error(response.message || "No se pudo eliminar el anuncio");
      }
    },
    onSuccess: invalidateListings,
  });
};

export const useRenewListingMutation = () => {
  const invalidateListings = useInvalidateMyListings();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await myListingsService.renew(id);
      if (!response.ok) {
        throw new Error(response.message || "No se pudo renovar el anuncio");
      }
      return response.data;
    },
    onSuccess: invalidateListings,
  });
};

export const useDuplicateListingMutation = () => {
  const invalidateListings = useInvalidateMyListings();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await myListingsService.duplicate(id);
      if (!response.ok) {
        throw new Error(response.message || "No se pudo duplicar el anuncio");
      }
      return response.data;
    },
    onSuccess: invalidateListings,
  });
};

export const useScheduleListingMutation = () => {
  const invalidateListings = useInvalidateMyListings();

  return useMutation({
    mutationFn: async ({
      id,
      scheduled_publish_at,
    }: {
      id: string;
      scheduled_publish_at: string;
    }) => {
      const response = await myListingsService.schedule(id, scheduled_publish_at);
      if (!response.ok) {
        throw new Error(response.message || "No se pudo programar el anuncio");
      }
      return response.data;
    },
    onSuccess: invalidateListings,
  });
};

export const useUpdateListingStatusMutation = () => {
  const invalidateListings = useInvalidateMyListings();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: VehicleStatus;
    }) => {
      const response = await myListingsService.updateStatus(id, status);
      if (!response.ok) {
        throw new Error(response.message || "No se pudo actualizar el estado");
      }
      return response.data;
    },
    onSuccess: invalidateListings,
  });
};

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

export const useFeatureListingAction = () => {
  const invalidateListings = useInvalidateMyListings();
  const invalidateBillingMe = useInvalidateBillingMe();
  const { getLimitUsage } = useEntitlements();
  const { featureOffers, featureOffer } = useFeaturedListingOffers();

  const canFeatureIncluded = getLimitUsage("featured_listings").canUseIncluded;

  const featureIncludedMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await myListingsService.feature(id);
      if (!response.ok) {
        throw new Error(response.message || "No se pudo destacar el anuncio");
      }
      return response.data;
    },
    onSuccess: async () => {
      await invalidateListings();
      await invalidateBillingMe();
    },
  });

  const featureCheckoutMutation = useMutation({
    mutationFn: async ({
      vehicleId,
      offerId,
    }: {
      vehicleId: string;
      offerId: string;
    }) => {
      const checkoutUrl = await billingService.createFeaturedListingCheckout(
        offerId,
        vehicleId,
        {
          success_url: absoluteUrl("/usuario/mis-anuncios?checkout=success"),
          cancel_url: absoluteUrl("/usuario/mis-anuncios?checkout=cancel"),
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

  const featureListing = async (vehicleId: string, offerId?: string) => {
    if (canFeatureIncluded && !offerId) {
      return featureIncludedMutation.mutateAsync(vehicleId);
    }

    const selectedOfferId = offerId ?? featureOffer?.id;
    if (!selectedOfferId) {
      throw new Error("No hay ofertas de destacado disponibles");
    }

    return featureCheckoutMutation.mutateAsync({
      vehicleId,
      offerId: selectedOfferId,
    });
  };

  const featurePriceLabel =
    canFeatureIncluded || !featureOffer
      ? null
      : new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: "EUR",
        }).format(featureOffer.amount_cents / 100);

  return {
    featureListing,
    featureOffers,
    featureOffer,
    featurePriceLabel,
    canFeatureIncluded,
    featureDurationDays: featureOffer?.duration_days ?? null,
    isFeaturing:
      featureIncludedMutation.isPending || featureCheckoutMutation.isPending,
    featuringOfferId: featureCheckoutMutation.variables?.offerId ?? null,
  };
};
