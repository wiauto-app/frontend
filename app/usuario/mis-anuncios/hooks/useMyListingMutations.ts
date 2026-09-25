"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { VehicleStatus } from "@/components/vehicles/constants/vehicle-status.constants";
import { myListingsService } from "@/services/myListings/myListingsService";
import { MY_LISTINGS_QUERY_KEY } from "./my-listings-query-keys";

// Los hooks de destacado viven en `listing-insights` para poder usarlos desde
// rutas públicas (p. ej. /publicar/exito) sin importar código de app/usuario.
export {
  useFeaturedListingOffers,
  useFeatureListingAction,
  type UseFeatureListingActionOptions,
} from "@/components/vehicles/listing-insights/hooks/useFeaturedListing";

const useInvalidateMyListings = () => {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: MY_LISTINGS_QUERY_KEY });
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
