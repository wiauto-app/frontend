"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DismissedVehicleItem,
  VehicleEngagementStatus,
} from "@/interfaces/vehicle-engagement.interface";
import {
  DISMISSED_VEHICLES_QUERY_KEY,
  VEHICLE_ENGAGEMENT_STATUS_QUERY_KEY,
  vehicleEngagementService,
} from "@/services/vehicleEngagementService";

export const useDismissedVehiclesPage = () => {
  const queryClient = useQueryClient();

  const dismissedQuery = useQuery({
    queryKey: DISMISSED_VEHICLES_QUERY_KEY,
    queryFn: async () => {
      const response = await vehicleEngagementService.findDismissedVehicles();
      if (!response.ok) {
        throw new Error(
          response.message || "No se pudieron cargar los descartados",
        );
      }
      return response.data;
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (vehicleId: string) => {
      const response =
        await vehicleEngagementService.restoreDismissedVehicle(vehicleId);
      if (response.status === 404) {
        return vehicleId;
      }
      if (!response.ok) {
        throw new Error(
          response.message || "No se pudo restaurar el vehículo",
        );
      }
      return vehicleId;
    },
    onMutate: async (vehicleId) => {
      await queryClient.cancelQueries({
        queryKey: DISMISSED_VEHICLES_QUERY_KEY,
      });
      const previous = queryClient.getQueryData<DismissedVehicleItem[]>(
        DISMISSED_VEHICLES_QUERY_KEY,
      );

      queryClient.setQueryData<DismissedVehicleItem[]>(
        DISMISSED_VEHICLES_QUERY_KEY,
        (current) =>
          (current ?? []).filter((item) => item.vehicle_id !== vehicleId),
      );

      return { previous };
    },
    onError: (_error, _vehicleId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          DISMISSED_VEHICLES_QUERY_KEY,
          context.previous,
        );
      }
    },
    onSuccess: (vehicleId) => {
      queryClient.setQueryData<VehicleEngagementStatus>(
        VEHICLE_ENGAGEMENT_STATUS_QUERY_KEY(vehicleId),
        (current) => ({
          isWatchingPrice: current?.isWatchingPrice ?? false,
          isDismissed: false,
        }),
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: DISMISSED_VEHICLES_QUERY_KEY,
      });
    },
  });

  return {
    items: dismissedQuery.data ?? [],
    isLoading: dismissedQuery.isLoading,
    isFetching: dismissedQuery.isFetching,
    error: dismissedQuery.error,
    restore: restoreMutation.mutateAsync,
    isRestoring: restoreMutation.isPending,
    restoringVehicleId: restoreMutation.isPending
      ? restoreMutation.variables
      : null,
    refetch: dismissedQuery.refetch,
  };
};
