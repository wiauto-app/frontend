"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import type { VehicleStatus } from "@/components/vehicles/constants/vehicle-status.constants";
import { myListingsService } from "@/services/myListings/myListingsService";
import { billingService } from "@/services/billingService";
import { useFiltersManager } from "@/hooks/useFiltersManager";
import { useEntitlements } from "@/hooks/useEntitlements";
import {
  resolveLimitUsage,
  withAvailableFeaturedCredits,
} from "@/lib/billing/entitlements";
import {
  DEFAULT_MY_LISTINGS_ORDER_VALUE,
  getMyListingsOrderOption,
} from "../constants/my-listings-order.constants";
import {
  MY_LISTINGS_FILTER_KEYS,
  MY_LISTINGS_FILTER_KEYS_LIST,
} from "../constants/my-listings-filter-keys.constants";
import {
  BILLING_ME_QUERY_KEY,
  MY_LISTINGS_QUERY_KEY,
} from "./my-listings-query-keys";
import { useFeaturedListingOffers } from "./useMyListingMutations";

export {
  BILLING_ME_QUERY_KEY,
  FEATURED_LISTING_OFFERS_QUERY_KEY,
  MY_LISTINGS_QUERY_KEY,
} from "./my-listings-query-keys";

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
  const { isPrivileged, getLimitUsage } = useEntitlements();
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

  const { featureOffers, featureOffer, isLoading: isOffersLoading } =
    useFeaturedListingOffers(enabled);

  const planFeaturedSlots = billingMeQuery.data?.entitlements?.featured_listings
    ? resolveLimitUsage(billingMeQuery.data.entitlements.featured_listings, {
        isPrivileged,
      })
    : getLimitUsage("featured_listings");

  const availableFeaturedCredits =
    billingMeQuery.data?.available_featured_credits ?? 0;

  const featuredSlots = withAvailableFeaturedCredits(
    planFeaturedSlots,
    availableFeaturedCredits,
  );

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
    featuredSlots,
    /** Cupo del plan sin sumar cupones (p. ej. copy de ayuda). */
    planFeaturedSlots,
    availableFeaturedCredits,
    isLoading: listingsQuery.isLoading,
    isBillingLoading: billingMeQuery.isLoading || isOffersLoading,
    isFetching: listingsQuery.isFetching,
    error: listingsQuery.error,
    refetch: listingsQuery.refetch,
    refetchBillingMe: billingMeQuery.refetch,
  };
};
