"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import type { VehicleStatus } from "@/components/vehicles/constants/vehicle-status.constants";
import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import { myListingsService } from "@/services/myListings/myListingsService";
import { billingService } from "@/services/billingService";
import { absoluteUrl } from "@/lib/seo/absolute-url";

export const MY_LISTINGS_QUERY_KEY = ["my-listings"] as const;
export const BILLING_ME_QUERY_KEY = ["billing-me"] as const;
export const BILLING_CATALOG_QUERY_KEY = ["billing-catalog"] as const;

const FEATURE_PLAN_SLUG = "destacar-vehiculo";

type UseMyListingsPageOptions = {
  audience?: string;
  enabled?: boolean;
};

export const useMyListingsPage = ({
  audience = "particular",
  enabled = true,
}: UseMyListingsPageOptions = {}) => {
  const queryClient = useQueryClient();

  const listingsQuery = useQuery({
    queryKey: MY_LISTINGS_QUERY_KEY,
    queryFn: async () => {
      const response = await myListingsService.findMine({ page: 1, limit: 50 });
      if (!response.ok || !response.data) {
        throw new Error(response.message || "No se pudieron cargar tus anuncios");
      }
      return response.data;
    },
    enabled,
  });

  const billingMeQuery = useQuery({
    queryKey: BILLING_ME_QUERY_KEY,
    queryFn: () => billingService.getMe(),
    enabled,
  });

  const billingCatalogQuery = useQuery({
    queryKey: [...BILLING_CATALOG_QUERY_KEY, audience],
    queryFn: () => billingService.getCatalog(audience),
    enabled,
  });

  const featurePlan = useMemo((): BillingCatalogPlan | null => {
    return (
      billingCatalogQuery.data?.find((plan) => plan.slug === FEATURE_PLAN_SLUG) ?? null
    );
  }, [billingCatalogQuery.data]);

  const featurePrice = useMemo(() => {
    return featurePlan?.prices.find((price) => price.interval === "one_time") ?? null;
  }, [featurePlan]);

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

  const featureMutation = useMutation({
    mutationFn: async (vehicleId: string) => {
      if (!featurePrice) {
        throw new Error("El plan de destacado no está disponible");
      }

      const checkoutUrl = await billingService.createOneTimeCheckout(
        featurePrice.id,
        { vehicle_id: vehicleId },
        {
          success_url: absoluteUrl("/mis-anuncios?checkout=success"),
          cancel_url: absoluteUrl("/mis-anuncios?checkout=cancel"),
        },
      );

      if (!checkoutUrl) {
        throw new Error("No se pudo iniciar el checkout de destacado");
      }

      return checkoutUrl;
    },
    onSuccess: (checkoutUrl) => {
      window.location.href = checkoutUrl;
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
      status: Extract<VehicleStatus, "active" | "inactive">;
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
    total: listingsQuery.data?.total ?? 0,
    billingMe: billingMeQuery.data ?? null,
    featurePlan,
    featurePrice,
    isLoading: listingsQuery.isLoading,
    isBillingLoading: billingMeQuery.isLoading || billingCatalogQuery.isLoading,
    isFetching: listingsQuery.isFetching,
    error: listingsQuery.error,
    refetch: listingsQuery.refetch,
    refetchBillingMe,
    duplicate: duplicateMutation.mutateAsync,
    isDuplicating: duplicateMutation.isPending,
    renew: renewMutation.mutateAsync,
    isRenewing: renewMutation.isPending,
    featureListing: featureMutation.mutateAsync,
    isFeaturing: featureMutation.isPending,
    schedule: scheduleMutation.mutateAsync,
    isScheduling: scheduleMutation.isPending,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
    remove: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
  };
};
