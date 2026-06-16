"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import type { VehicleStatus } from "@/components/vehicles/constants/vehicle-status.constants";
import { myListingsService } from "@/services/myListings/myListingsService";

export const MY_LISTINGS_QUERY_KEY = ["my-listings"] as const;

export const useMyListingsPage = () => {
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
  });

  const invalidateListings = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: MY_LISTINGS_QUERY_KEY });
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
    isLoading: listingsQuery.isLoading,
    isFetching: listingsQuery.isFetching,
    error: listingsQuery.error,
    refetch: listingsQuery.refetch,
    duplicate: duplicateMutation.mutateAsync,
    isDuplicating: duplicateMutation.isPending,
    renew: renewMutation.mutateAsync,
    isRenewing: renewMutation.isPending,
    schedule: scheduleMutation.mutateAsync,
    isScheduling: scheduleMutation.isPending,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
    remove: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
  };
};
