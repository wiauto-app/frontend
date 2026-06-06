"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  VehicleList,
  VehicleListItemRecord,
} from "@/interfaces/vehicle-list.interface";
import { vehicleListService } from "@/services/vehicleListService";
import { resolveDefaultVehicleList } from "@/app/(public)/vehiculos/hooks/useVehicleListMembership";

export const VEHICLE_LISTS_QUERY_KEY = ["vehicle-lists"] as const;

export const vehicleListItemsQueryKey = (listId: string) =>
  ["vehicle-list-items", listId] as const;

const fetchListItemCount = async (listId: string): Promise<number> => {
  const response = await vehicleListService.findItems(listId);
  if (!response.ok || !response.data) {
    return 0;
  }
  return response.data.length;
};

const fetchAllListItemCounts = async (
  lists: VehicleList[],
): Promise<Record<string, number>> => {
  const entries = await Promise.all(
    lists.map(async (list) => [list.id, await fetchListItemCount(list.id)] as const),
  );
  return Object.fromEntries(entries);
};

export const useFavoritesPage = () => {
  const queryClient = useQueryClient();
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const listsQuery = useQuery({
    queryKey: VEHICLE_LISTS_QUERY_KEY,
    queryFn: async () => {
      const response = await vehicleListService.findAll();
      if (!response.ok || !response.data) {
        throw new Error(response.message || "No se pudieron cargar las listas");
      }
      return response.data;
    },
  });

  const lists = useMemo(() => listsQuery.data ?? [], [listsQuery.data]);

  useEffect(() => {
    if (!lists.length || selectedListId) {
      return;
    }

    const defaultList = resolveDefaultVehicleList(lists);
    if (defaultList) {
      setSelectedListId(defaultList.id);
    }
  }, [lists, selectedListId]);

  const itemCountsQuery = useQuery({
    queryKey: [...VEHICLE_LISTS_QUERY_KEY, "counts", lists.map((list) => list.id)],
    queryFn: () => fetchAllListItemCounts(lists),
    enabled: lists.length > 0,
  });

  const itemsQuery = useQuery({
    queryKey: selectedListId
      ? vehicleListItemsQueryKey(selectedListId)
      : ["vehicle-list-items", "none"],
    queryFn: async () => {
      if (!selectedListId) {
        return [];
      }

      const response = await vehicleListService.findItems(selectedListId);
      if (!response.ok || !response.data) {
        throw new Error(response.message || "No se pudieron cargar los favoritos");
      }
      return response.data;
    },
    enabled: !!selectedListId,
  });

  const invalidateLists = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: VEHICLE_LISTS_QUERY_KEY });
  }, [queryClient]);

  const invalidateItems = useCallback(
    async (listId?: string | null) => {
      const targetListId = listId ?? selectedListId;
      if (!targetListId) {
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: vehicleListItemsQueryKey(targetListId),
      });
    },
    [queryClient, selectedListId],
  );

  const createListMutation = useMutation({
    mutationFn: async ({
      name,
      description,
    }: {
      name: string;
      description?: string;
    }) => {
      const response = await vehicleListService.create({
        name: name.trim(),
        description: description?.trim() || null,
      });

      if (!response.ok || !response.data) {
        throw new Error(response.message || "No se pudo crear la lista");
      }

      return response.data;
    },
    onSuccess: async (createdList) => {
      await invalidateLists();
      setSelectedListId(createdList.id);
    },
  });

  const updateListMutation = useMutation({
    mutationFn: async ({ listId, name }: { listId: string; name: string }) => {
      const response = await vehicleListService.update(listId, {
        name: name.trim(),
      });

      if (!response.ok) {
        throw new Error(response.message || "No se pudo renombrar la lista");
      }
    },
    onSuccess: invalidateLists,
  });

  const removeListMutation = useMutation({
    mutationFn: async (listId: string) => {
      const response = await vehicleListService.remove(listId);
      if (!response.ok) {
        throw new Error(response.message || "No se pudo eliminar la lista");
      }
    },
    onSuccess: async (_data, removedListId) => {
      await invalidateLists();

      if (selectedListId === removedListId) {
        const refreshedLists =
          queryClient.getQueryData<VehicleList[]>(VEHICLE_LISTS_QUERY_KEY) ?? [];
        const defaultList = resolveDefaultVehicleList(refreshedLists);
        setSelectedListId(defaultList?.id ?? null);
      }
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async ({
      listId,
      vehicleId,
    }: {
      listId: string;
      vehicleId: string;
    }) => {
      const response = await vehicleListService.removeItem(listId, vehicleId);
      if (response.status === 404) {
        return;
      }
      if (!response.ok) {
        throw new Error(response.message || "No se pudo quitar el vehículo");
      }
    },
    onSuccess: async (_data, variables) => {
      await invalidateItems(variables.listId);
      await queryClient.invalidateQueries({ queryKey: VEHICLE_LISTS_QUERY_KEY });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async ({
      listId,
      vehicleId,
    }: {
      listId: string;
      vehicleId: string;
    }) => {
      const response = await vehicleListService.addItem(listId, vehicleId);
      if (response.status === 409) {
        return;
      }
      if (!response.ok) {
        throw new Error(response.message || "No se pudo agregar el vehículo");
      }
    },
    onSuccess: async (_data, variables) => {
      await invalidateItems(variables.listId);
      await queryClient.invalidateQueries({ queryKey: VEHICLE_LISTS_QUERY_KEY });
    },
  });

  const moveItem = async (
    fromListId: string,
    toListId: string,
    vehicleId: string,
  ) => {
    await removeItemMutation.mutateAsync({ listId: fromListId, vehicleId });
    await addItemMutation.mutateAsync({ listId: toListId, vehicleId });
  };

  const copyItem = async (toListId: string, vehicleId: string) => {
    await addItemMutation.mutateAsync({ listId: toListId, vehicleId });
  };

  const selectedList = useMemo(
    () => lists.find((list) => list.id === selectedListId) ?? null,
    [lists, selectedListId],
  );

  const itemCounts = itemCountsQuery.data ?? {};

  return {
    lists,
    items: itemsQuery.data ?? [],
    selectedListId,
    selectedList,
    itemCounts,
    isLoadingLists: listsQuery.isLoading,
    isLoadingItems: itemsQuery.isLoading,
    isFetchingItems: itemsQuery.isFetching,
    listsError: listsQuery.error,
    itemsError: itemsQuery.error,
    setSelectedListId,
    createList: createListMutation.mutateAsync,
    isCreatingList: createListMutation.isPending,
    updateList: updateListMutation.mutateAsync,
    isUpdatingList: updateListMutation.isPending,
    removeList: removeListMutation.mutateAsync,
    isRemovingList: removeListMutation.isPending,
    removeItem: removeItemMutation.mutateAsync,
    moveItem,
    copyItem,
    isRemovingItem: removeItemMutation.isPending,
    isMovingOrCopying: addItemMutation.isPending || removeItemMutation.isPending,
    refetchItems: itemsQuery.refetch,
  };
};

export type FavoritesPageItem = VehicleListItemRecord;
