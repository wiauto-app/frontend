"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VehicleSearchHistoryItem } from "@/interfaces/vehicle-search-history.interface";
import {
  VEHICLE_SEARCH_HISTORY_QUERY_KEY,
  vehicleSearchHistoryService,
} from "@/services/vehicleSearchHistoryService";

const HISTORY_LIMIT = 20;

type HistorySnapshot = { previous: VehicleSearchHistoryItem[] | undefined };

export const useRecentSearchesPage = () => {
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: VEHICLE_SEARCH_HISTORY_QUERY_KEY,
    queryFn: async () => {
      const response = await vehicleSearchHistoryService.findAll(HISTORY_LIMIT);
      if (!response.ok || !Array.isArray(response.data)) {
        throw new Error(
          response.message || "No se pudieron cargar tus búsquedas recientes",
        );
      }
      return response.data;
    },
  });

  /** Aplica el cambio en cache al instante y devuelve el estado previo para rollback. */
  const applyOptimistic = async (
    updater: (items: VehicleSearchHistoryItem[]) => VehicleSearchHistoryItem[],
  ): Promise<HistorySnapshot> => {
    await queryClient.cancelQueries({ queryKey: VEHICLE_SEARCH_HISTORY_QUERY_KEY });
    const previous = queryClient.getQueryData<VehicleSearchHistoryItem[]>(
      VEHICLE_SEARCH_HISTORY_QUERY_KEY,
    );
    queryClient.setQueryData<VehicleSearchHistoryItem[]>(
      VEHICLE_SEARCH_HISTORY_QUERY_KEY,
      (current) => updater(current ?? []),
    );
    return { previous };
  };

  const rollback = (snapshot: HistorySnapshot | undefined) => {
    if (snapshot?.previous) {
      queryClient.setQueryData(VEHICLE_SEARCH_HISTORY_QUERY_KEY, snapshot.previous);
    }
  };

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: VEHICLE_SEARCH_HISTORY_QUERY_KEY });

  const removeMutation = useMutation<void, Error, string, HistorySnapshot>({
    mutationFn: async (id) => {
      const response = await vehicleSearchHistoryService.remove(id);
      if (!response.ok) {
        throw new Error("No se pudo eliminar la búsqueda. Inténtalo de nuevo.");
      }
    },
    onMutate: (id) =>
      applyOptimistic((items) => items.filter((item) => item.id !== id)),
    onError: (_error, _id, snapshot) => rollback(snapshot),
    onSettled: invalidate,
  });

  const clearMutation = useMutation<void, Error, void, HistorySnapshot>({
    mutationFn: async () => {
      const response = await vehicleSearchHistoryService.clear();
      if (!response.ok) {
        throw new Error("No se pudo borrar el historial. Inténtalo de nuevo.");
      }
    },
    onMutate: () => applyOptimistic(() => []),
    onError: (_error, _vars, snapshot) => rollback(snapshot),
    onSettled: invalidate,
  });

  return {
    items: historyQuery.data ?? [],
    isLoading: historyQuery.isPending,
    error: historyQuery.error,
    isRefetching: historyQuery.isRefetching,
    refetch: historyQuery.refetch,
    removeSearch: removeMutation.mutateAsync,
    clearHistory: clearMutation.mutateAsync,
    isClearing: clearMutation.isPending,
  };
};
