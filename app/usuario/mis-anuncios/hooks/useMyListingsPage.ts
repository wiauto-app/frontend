"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import type { VehicleStatus } from "@/components/vehicles/constants/vehicle-status.constants";
import type { FeaturedListingOffer } from "@/interfaces/billing.interface";
import { myListingsService } from "@/services/myListings/myListingsService";
import { billingService } from "@/services/billingService";
import { absoluteUrl } from "@/lib/seo/absolute-url";
import { rememberPendingPurchase } from "@/lib/analytics/events";
import { useFiltersManager } from "@/hooks/useFiltersManager";
import {
  DEFAULT_MY_LISTINGS_ORDER_VALUE,
  getMyListingsOrderOption,
} from "../constants/my-listings-order.constants";
import {
  MY_LISTINGS_FILTER_KEYS,
  MY_LISTINGS_FILTER_KEYS_LIST,
} from "../constants/my-listings-filter-keys.constants";

export const MY_LISTINGS_QUERY_KEY = ["my-listings"] as const;
export const BILLING_ME_QUERY_KEY = ["billing-me"] as const;
export const FEATURED_LISTING_OFFERS_QUERY_KEY = [
  "featured-listing-offers-catalog",
] as const;

const MY_LISTINGS_PAGE_LIMIT = 20;

export interface MyListingsFilters {
  status: VehicleStatus | null;
  makeId: number | null;
  modelId: number | null;
  sinceCreatedAt: string;
  untilCreatedAt: string;
  order: string;
}

const toSingleString = (
  value: string | string[] | undefined,
): string | undefined => {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value[0];
  }
  return undefined;
};

const parsePositiveInt = (value: string | undefined): number | null => {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return Math.trunc(parsed);
};

interface UseMyListingsPageOptions {
  enabled?: boolean;
}

export const useMyListingsPage = ({
  enabled = true,
}: UseMyListingsPageOptions = {}) => {
  const queryClient = useQueryClient();
  const {
    values,
    applyUrlUpdates,
    handleClearAll,
  } = useFiltersManager({
    keys: MY_LISTINGS_FILTER_KEYS_LIST,
  });

  const filters = useMemo((): MyListingsFilters => {
    const status = toSingleString(values[MY_LISTINGS_FILTER_KEYS.STATUS]);
    const order =
      toSingleString(values[MY_LISTINGS_FILTER_KEYS.ORDER]) ??
      DEFAULT_MY_LISTINGS_ORDER_VALUE;

    return {
      status: (status as VehicleStatus | undefined) ?? null,
      makeId: parsePositiveInt(
        toSingleString(values[MY_LISTINGS_FILTER_KEYS.MAKE_ID]),
      ),
      modelId: parsePositiveInt(
        toSingleString(values[MY_LISTINGS_FILTER_KEYS.MODEL_ID]),
      ),
      sinceCreatedAt:
        toSingleString(values[MY_LISTINGS_FILTER_KEYS.SINCE_CREATED_AT]) ?? "",
      untilCreatedAt:
        toSingleString(values[MY_LISTINGS_FILTER_KEYS.UNTIL_CREATED_AT]) ?? "",
      order,
    };
  }, [values]);

  const page = useMemo(() => {
    const raw = toSingleString(values[MY_LISTINGS_FILTER_KEYS.PAGE]);
    const parsed = parsePositiveInt(raw);
    return parsed ?? 1;
  }, [values]);

  const orderOption = getMyListingsOrderOption(filters.order);

  const listingsQuery = useQuery({
    queryKey: [...MY_LISTINGS_QUERY_KEY, filters, page],
    queryFn: async () => {
      const response = await myListingsService.findMine({
        page,
        limit: MY_LISTINGS_PAGE_LIMIT,
        status: filters.status ?? undefined,
        make_id: filters.makeId ?? undefined,
        model_id: filters.modelId ?? undefined,
        since_created_at: filters.sinceCreatedAt || undefined,
        until_created_at: filters.untilCreatedAt || undefined,
        order_by: orderOption.order_by,
        order_direction: orderOption.order_direction,
      });
      if (!response.ok || !response.data) {
        throw new Error(response.message || "No se pudieron cargar tus anuncios");
      }
      return response.data;
    },
    enabled,
  });

  const updateFilters = useCallback(
    (patch: Partial<MyListingsFilters>) => {
      const updates: Record<string, string | undefined> = {
        [MY_LISTINGS_FILTER_KEYS.PAGE]: undefined,
      };

      if ("status" in patch) {
        updates[MY_LISTINGS_FILTER_KEYS.STATUS] = patch.status ?? undefined;
      }
      if ("makeId" in patch) {
        updates[MY_LISTINGS_FILTER_KEYS.MAKE_ID] =
          patch.makeId != null ? String(patch.makeId) : undefined;
      }
      if ("modelId" in patch) {
        updates[MY_LISTINGS_FILTER_KEYS.MODEL_ID] =
          patch.modelId != null ? String(patch.modelId) : undefined;
      }
      if ("sinceCreatedAt" in patch) {
        updates[MY_LISTINGS_FILTER_KEYS.SINCE_CREATED_AT] =
          patch.sinceCreatedAt || undefined;
      }
      if ("untilCreatedAt" in patch) {
        updates[MY_LISTINGS_FILTER_KEYS.UNTIL_CREATED_AT] =
          patch.untilCreatedAt || undefined;
      }
      if ("order" in patch) {
        updates[MY_LISTINGS_FILTER_KEYS.ORDER] =
          patch.order && patch.order !== DEFAULT_MY_LISTINGS_ORDER_VALUE
            ? patch.order
            : undefined;
      }

      applyUrlUpdates(updates);
    },
    [applyUrlUpdates],
  );

  const resetFilters = useCallback(() => {
    handleClearAll();
  }, [handleClearAll]);

  const onPageChange = useCallback(
    (nextPage: number) => {
      applyUrlUpdates({
        [MY_LISTINGS_FILTER_KEYS.PAGE]:
          nextPage > 1 ? String(nextPage) : undefined,
      });
    },
    [applyUrlUpdates],
  );

  const total = listingsQuery.data?.total ?? 0;
  const limit = listingsQuery.data?.limit ?? MY_LISTINGS_PAGE_LIMIT;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const billingMeQuery = useQuery({
    queryKey: BILLING_ME_QUERY_KEY,
    queryFn: () => billingService.getMe(),
    enabled,
  });

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

  const featureOffer = featureOffers[0] ?? null;

  const invalidateListings = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: MY_LISTINGS_QUERY_KEY });
  }, [queryClient]);

  const refetchBillingMe = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: BILLING_ME_QUERY_KEY });
  }, [queryClient]);

  const duplicateMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await myListingsService.duplicate(id);
      if (!response.ok) {
        throw new Error(response.message || "No se pudo duplicar el anuncio");
      }
      return response.data;
    },
    onSuccess: invalidateListings,
  });

  const renewMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await myListingsService.renew(id);
      if (!response.ok) {
        throw new Error(response.message || "No se pudo renovar el anuncio");
      }
      return response.data;
    },
    onSuccess: invalidateListings,
  });

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
      await refetchBillingMe();
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
          success_url: absoluteUrl(
            "/usuario/mis-anuncios?checkout=success",
          ),
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

  const scheduleMutation = useMutation({
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

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: VehicleStatus
    }) => {
      const response = await myListingsService.updateStatus(id, status);
      if (!response.ok) {
        throw new Error(response.message || "No se pudo actualizar el estado");
      }
      return response.data;
    },
    onSuccess: invalidateListings,
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await myListingsService.remove(id);
      if (!response.ok && response.status !== 204) {
        throw new Error(response.message || "No se pudo eliminar el anuncio");
      }
    },
    onSuccess: invalidateListings,
  });

  const listings: OwnerVehicleListItem[] = listingsQuery.data?.data ?? [];

  return {
    listings,
    total,
    page,
    totalPages,
    onPageChange,
    filters,
    updateFilters,
    resetFilters,
    billingMe: billingMeQuery.data ?? null,
    featureOffers,
    featureOffer,
    featureDurationDays: featureOffer?.duration_days ?? null,
    isLoading: listingsQuery.isLoading,
    isBillingLoading: billingMeQuery.isLoading || featuredOffersQuery.isLoading,
    isFetching: listingsQuery.isFetching,
    error: listingsQuery.error,
    refetch: listingsQuery.refetch,
    refetchBillingMe,
    duplicate: duplicateMutation.mutateAsync,
    isDuplicating: duplicateMutation.isPending,
    renew: renewMutation.mutateAsync,
    isRenewing: renewMutation.isPending,
    featureIncluded: featureIncludedMutation.mutateAsync,
    featureListing: featureCheckoutMutation.mutateAsync,
    isFeaturing:
      featureIncludedMutation.isPending || featureCheckoutMutation.isPending,
    schedule: scheduleMutation.mutateAsync,
    isScheduling: scheduleMutation.isPending,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
    remove: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
  };
};
