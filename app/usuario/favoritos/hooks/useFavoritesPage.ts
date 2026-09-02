"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  VehicleList,
  VehicleListItemRecord,
} from "@/interfaces/vehicle-list.interface";
import { vehicleListService } from "@/services/vehicleListService";
import { resolveDefaultVehicleList } from "@/app/(public)/vehiculos/hooks/useVehicleListMembership";

export const FAVORITES_PAGE_SIZE = 10;

export const VEHICLE_LISTS_QUERY_KEY = ["vehicle-lists"] as const;

export const vehicleListItemsQueryKey = (
  listId: string,
  page: number,
  limit: number,
) => ["vehicle-list-items", listId, page, limit] as const;

export const useFavoritesPage = () => {
  const queryClient = useQueryClient();
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

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

  useEffect(() => {
    setPage(1);
  }, [selectedListId]);

  const itemsQuery = useQuery({
    queryKey: selectedListId
      ? vehicleListItemsQueryKey(selectedListId, page, FAVORITES_PAGE_SIZE)
      : ["vehicle-list-items", "none"],
    queryFn: async () => {
      if (!selectedListId) {
        return {
          data: [] as VehicleListItemRecord[],
          total: 0,
          page: 1,
          limit: FAVORITES_PAGE_SIZE,
        };
      }

      const response = await vehicleListService.findItems(selectedListId, {
        page,
        limit: FAVORITES_PAGE_SIZE,
      });
      if (!response.ok || !response.data) {
        throw new Error(response.message || "No se pudieron cargar los favoritos");
      }
      return response.data;
    },
    enabled: !!selectedListId,
  });

  const total = itemsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / FAVORITES_PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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
        queryKey: ["vehicle-list-items", targetListId],
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
      setPage(1);
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
        setPage(1);
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
      const currentTotal = itemsQuery.data?.total ?? 0;
      const isLastItemOnPage =
        (itemsQuery.data?.data.length ?? 0) === 1 && page > 1;
      const willBeEmptyOnCurrentPage =
        currentTotal - 1 <= (page - 1) * FAVORITES_PAGE_SIZE && page > 1;

      if (isLastItemOnPage || willBeEmptyOnCurrentPage) {
        setPage((currentPage) => Math.max(1, currentPage - 1));
      }

      await invalidateItems(variables.listId);
      await invalidateLists();
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
      await invalidateLists();
    },
  });

  const moveItem = async (
    fromListId: string,
    toListId: string,
    vehicleId: string,
  ) => {
    await addItemMutation.mutateAsync({ listId: toListId, vehicleId });
    await removeItemMutation.mutateAsync({ listId: fromListId, vehicleId });
  };

  const copyItem = async (toListId: string, vehicleId: string) => {
    await addItemMutation.mutateAsync({ listId: toListId, vehicleId });
  };

  const selectedList = useMemo(
    () => lists.find((list) => list.id === selectedListId) ?? null,
    [lists, selectedListId],
  );

  const itemCounts = useMemo(
    () =>
      Object.fromEntries(
        lists.map((list) => [list.id, list.item_count ?? 0]),
      ),
    [lists],
  );

  const handleSetSelectedListId = useCallback((listId: string) => {
    setSelectedListId(listId);
    setPage(1);
  }, []);

  return {
    lists,
    items: itemsQuery.data?.data ?? [],
    total,
    page,
    limit: FAVORITES_PAGE_SIZE,
    totalPages,
    selectedListId,
    selectedList,
    itemCounts,
    isLoadingLists: listsQuery.isLoading,
    isLoadingItems: itemsQuery.isLoading,
    isFetchingItems: itemsQuery.isFetching,
    listsError: listsQuery.error,
    itemsError: itemsQuery.error,
    setSelectedListId: handleSetSelectedListId,
    setPage,
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
