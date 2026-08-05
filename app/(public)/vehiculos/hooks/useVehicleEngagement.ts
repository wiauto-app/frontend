"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DISMISSED_VEHICLES_QUERY_KEY,
  VEHICLE_ENGAGEMENT_STATUS_QUERY_KEY,
  vehicleEngagementService,
} from "@/services/vehicleEngagementService";
import type { VehicleEngagementStatus } from "@/interfaces/vehicle-engagement.interface";

interface UseVehicleEngagementOptions {
  vehicleId: string;
  enabled?: boolean;
}

const DEFAULT_STATUS: VehicleEngagementStatus = {
  isWatchingPrice: false,
  isDismissed: false,
};

export const useVehicleEngagement = ({
  vehicleId,
  enabled = false,
}: UseVehicleEngagementOptions) => {
  const queryClient = useQueryClient();
  const statusQueryKey = VEHICLE_ENGAGEMENT_STATUS_QUERY_KEY(vehicleId);

  const statusQuery = useQuery({
    queryKey: statusQueryKey,
    queryFn: () => vehicleEngagementService.getStatus(vehicleId),
    enabled: enabled && !!vehicleId,
    staleTime: 30_000,
  });

  const status = statusQuery.data ?? DEFAULT_STATUS;

  const setStatus = (next: VehicleEngagementStatus) => {
    queryClient.setQueryData<VehicleEngagementStatus>(statusQueryKey, next);
  };

  const activatePriceWatchMutation = useMutation({
    mutationFn: async () => {
      const response =
        await vehicleEngagementService.activatePriceWatch(vehicleId);
      if (response.status === 409) {
        return;
      }
      if (!response.ok) {
        throw new Error(
          response.message || "No se pudo activar el aviso de bajada",
        );
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: statusQueryKey });
      const previous = queryClient.getQueryData<VehicleEngagementStatus>(
        statusQueryKey,
      );
      setStatus({
        ...(previous ?? DEFAULT_STATUS),
        isWatchingPrice: true,
      });
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(statusQueryKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: statusQueryKey });
    },
  });

  const deactivatePriceWatchMutation = useMutation({
    mutationFn: async () => {
      const response =
        await vehicleEngagementService.deactivatePriceWatch(vehicleId);
      if (response.status === 404) {
        return;
      }
      if (!response.ok) {
        throw new Error(
          response.message || "No se pudo desactivar el aviso de bajada",
        );
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: statusQueryKey });
      const previous = queryClient.getQueryData<VehicleEngagementStatus>(
        statusQueryKey,
      );
      setStatus({
        ...(previous ?? DEFAULT_STATUS),
        isWatchingPrice: false,
      });
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(statusQueryKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: statusQueryKey });
    },
  });

  const dismissMutation = useMutation({
    mutationFn: async () => {
      const response =
        await vehicleEngagementService.dismissVehicle(vehicleId);
      if (response.status === 409) {
        return;
      }
      if (!response.ok) {
        throw new Error(response.message || "No se pudo descartar el vehículo");
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: statusQueryKey });
      const previous = queryClient.getQueryData<VehicleEngagementStatus>(
        statusQueryKey,
      );
      setStatus({
        ...(previous ?? DEFAULT_STATUS),
        isDismissed: true,
      });
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(statusQueryKey, context.previous);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: DISMISSED_VEHICLES_QUERY_KEY,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: statusQueryKey });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      const response =
        await vehicleEngagementService.restoreDismissedVehicle(vehicleId);
      if (response.status === 404) {
        return;
      }
      if (!response.ok) {
        throw new Error(
          response.message || "No se pudo restaurar el vehículo",
        );
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: statusQueryKey });
      const previous = queryClient.getQueryData<VehicleEngagementStatus>(
        statusQueryKey,
      );
      setStatus({
        ...(previous ?? DEFAULT_STATUS),
        isDismissed: false,
      });
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(statusQueryKey, context.previous);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: DISMISSED_VEHICLES_QUERY_KEY,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: statusQueryKey });
    },
  });

  const togglePriceWatch = async () => {
    if (status.isWatchingPrice) {
      await deactivatePriceWatchMutation.mutateAsync();
      return;
    }
    await activatePriceWatchMutation.mutateAsync();
  };

  const toggleDismiss = async () => {
    if (status.isDismissed) {
      await restoreMutation.mutateAsync();
      return;
    }
    await dismissMutation.mutateAsync();
  };

  return {
    status,
    isLoadingStatus: statusQuery.isLoading,
    isFetchingStatus: statusQuery.isFetching,
    togglePriceWatch,
    toggleDismiss,
    dismiss: dismissMutation.mutateAsync,
    restore: restoreMutation.mutateAsync,
    isTogglingPriceWatch:
      activatePriceWatchMutation.isPending ||
      deactivatePriceWatchMutation.isPending,
    isTogglingDismiss:
      dismissMutation.isPending || restoreMutation.isPending,
  };
};
