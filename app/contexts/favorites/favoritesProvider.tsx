"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useUser } from "@/app/contexts/auth/useUser";
import type { VehicleListFavoritesSnapshot } from "@/interfaces/vehicle-list-favorites.interface";
import type { VehicleList } from "@/interfaces/vehicle-list.interface";
import { trackAddToWishlist } from "@/lib/analytics/events";
import { favoritesService } from "@/services/favoritesService";
import { vehicleListService } from "@/services/vehicleListService";
import {
  applyAddToList,
  applyCreateList,
  applyRemoveFromList,
  EMPTY_FAVORITES_SNAPSHOT,
  favoritePendingKey,
  replaceOptimisticListId,
  resolveDefaultVehicleList,
} from "./favoritesCache";
import {
  FavoritesContext,
  VEHICLE_LIST_FAVORITES_QUERY_KEY,
  type CreateFavoriteListInput,
} from "./favoritesContext";

const EMPTY_MEMBERSHIP: ReadonlySet<string> = new Set();

interface FavoritesProviderProps {
  children: React.ReactNode;
}

interface ListMembershipInput {
  vehicleId: string;
  listId: string;
}

interface AddToListResult {
  vehicleId: string;
  alreadyInList: boolean;
}

const readSnapshot = (
  current: VehicleListFavoritesSnapshot | undefined,
): VehicleListFavoritesSnapshot => current ?? EMPTY_FAVORITES_SNAPSHOT;

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading } = useUser();
  const [pendingKeys, setPendingKeys] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const setMembershipPending = useCallback(
    (vehicleId: string, listId: string, pending: boolean) => {
      const key = favoritePendingKey(vehicleId, listId);
      setPendingKeys((current) => {
        const next = new Set(current);
        if (pending) {
          next.add(key);
        } else {
          next.delete(key);
        }
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    if (isAuthLoading || isAuthenticated) {
      return;
    }

    queryClient.removeQueries({ queryKey: VEHICLE_LIST_FAVORITES_QUERY_KEY });
  }, [isAuthenticated, isAuthLoading, queryClient]);

  const favoritesQuery = useQuery({
    queryKey: VEHICLE_LIST_FAVORITES_QUERY_KEY,
    queryFn: async () => {
      const response = await favoritesService.getSnapshot();
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudieron cargar los favoritos",
        );
      }
      return response.data;
    },
    enabled: isAuthenticated,
  });

  const snapshot = isAuthenticated ? favoritesQuery.data : undefined;

  const lists = useMemo(() => snapshot?.lists ?? [], [snapshot?.lists]);

  const favoriteIds = useMemo(() => {
    const ids = new Set<string>();
    for (const membership of snapshot?.memberships ?? []) {
      if (membership.list_ids.length > 0) {
        ids.add(membership.vehicle_id);
      }
    }
    return ids;
  }, [snapshot?.memberships]);

  const membershipByVehicle = useMemo(() => {
    const map = new Map<string, ReadonlySet<string>>();
    for (const membership of snapshot?.memberships ?? []) {
      map.set(membership.vehicle_id, new Set(membership.list_ids));
    }
    return map;
  }, [snapshot?.memberships]);

  const addToListMutation = useMutation({
    mutationFn: async ({
      vehicleId,
      listId,
    }: ListMembershipInput): Promise<AddToListResult> => {
      const response = await vehicleListService.addItem(listId, vehicleId);
      if (response.status === 409) {
        return { vehicleId, alreadyInList: true };
      }
      if (!response.ok) {
        throw new Error(response.message || "No se pudo agregar a la lista");
      }
      return { vehicleId, alreadyInList: false };
    },
    onMutate: async ({ vehicleId, listId }) => {
      await queryClient.cancelQueries({
        queryKey: VEHICLE_LIST_FAVORITES_QUERY_KEY,
      });
      const previous = queryClient.getQueryData<VehicleListFavoritesSnapshot>(
        VEHICLE_LIST_FAVORITES_QUERY_KEY,
      );
      queryClient.setQueryData<VehicleListFavoritesSnapshot>(
        VEHICLE_LIST_FAVORITES_QUERY_KEY,
        (current) => applyAddToList(readSnapshot(current), vehicleId, listId),
      );
      setMembershipPending(vehicleId, listId, true);
      return { previous };
    },
    onSuccess: (result) => {
      if (!result.alreadyInList) {
        trackAddToWishlist({ id: result.vehicleId });
      }
    },
    onError: (_error, _input, context) => {
      queryClient.setQueryData(
        VEHICLE_LIST_FAVORITES_QUERY_KEY,
        context?.previous ?? EMPTY_FAVORITES_SNAPSHOT,
      );
    },
    onSettled: (_data, _error, { vehicleId, listId }) => {
      setMembershipPending(vehicleId, listId, false);
      void queryClient.invalidateQueries({
        queryKey: VEHICLE_LIST_FAVORITES_QUERY_KEY,
      });
    },
  });

  const removeFromListMutation = useMutation({
    mutationFn: async ({ vehicleId, listId }: ListMembershipInput) => {
      const response = await vehicleListService.removeItem(listId, vehicleId);
      if (response.status === 404) {
        return;
      }
      if (!response.ok) {
        throw new Error(response.message || "No se pudo quitar de la lista");
      }
    },
    onMutate: async ({ vehicleId, listId }) => {
      await queryClient.cancelQueries({
        queryKey: VEHICLE_LIST_FAVORITES_QUERY_KEY,
      });
      const previous = queryClient.getQueryData<VehicleListFavoritesSnapshot>(
        VEHICLE_LIST_FAVORITES_QUERY_KEY,
      );
      queryClient.setQueryData<VehicleListFavoritesSnapshot>(
        VEHICLE_LIST_FAVORITES_QUERY_KEY,
        (current) =>
          applyRemoveFromList(readSnapshot(current), vehicleId, listId),
      );
      setMembershipPending(vehicleId, listId, true);
      return { previous };
    },
    onError: (_error, _input, context) => {
      queryClient.setQueryData(
        VEHICLE_LIST_FAVORITES_QUERY_KEY,
        context?.previous ?? EMPTY_FAVORITES_SNAPSHOT,
      );
    },
    onSettled: (_data, _error, { vehicleId, listId }) => {
      setMembershipPending(vehicleId, listId, false);
      void queryClient.invalidateQueries({
        queryKey: VEHICLE_LIST_FAVORITES_QUERY_KEY,
      });
    },
  });

  const createListMutation = useMutation({
    mutationFn: async ({
      vehicleId,
      name,
      description,
    }: CreateFavoriteListInput): Promise<VehicleList> => {
      const createResponse = await vehicleListService.create({
        name,
        description: description?.trim() || null,
      });

      if (!createResponse.ok || !createResponse.data) {
        throw new Error(createResponse.message || "No se pudo crear la lista");
      }

      const addResponse = await vehicleListService.addItem(
        createResponse.data.id,
        vehicleId,
      );

      if (addResponse.status !== 409 && !addResponse.ok) {
        throw new Error(addResponse.message || "No se pudo agregar a la lista");
      }

      return createResponse.data;
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({
        queryKey: VEHICLE_LIST_FAVORITES_QUERY_KEY,
      });
      const previous = queryClient.getQueryData<VehicleListFavoritesSnapshot>(
        VEHICLE_LIST_FAVORITES_QUERY_KEY,
      );
      const tempId = `optimistic-${crypto.randomUUID()}`;
      queryClient.setQueryData<VehicleListFavoritesSnapshot>(
        VEHICLE_LIST_FAVORITES_QUERY_KEY,
        (current) =>
          applyCreateList(readSnapshot(current), { ...input, tempId }),
      );
      return { previous, tempId };
    },
    onSuccess: (createdList, input, context) => {
      if (context?.tempId) {
        queryClient.setQueryData<VehicleListFavoritesSnapshot>(
          VEHICLE_LIST_FAVORITES_QUERY_KEY,
          (current) =>
            current
              ? replaceOptimisticListId(current, context.tempId, createdList)
              : current,
        );
      }
      trackAddToWishlist({ id: input.vehicleId });
    },
    onError: (_error, _input, context) => {
      queryClient.setQueryData(
        VEHICLE_LIST_FAVORITES_QUERY_KEY,
        context?.previous ?? EMPTY_FAVORITES_SNAPSHOT,
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: VEHICLE_LIST_FAVORITES_QUERY_KEY,
      });
    },
  });

  const { mutateAsync: addToListMutate } = addToListMutation;
  const { mutateAsync: removeFromListMutate } = removeFromListMutation;
  const { mutateAsync: createListMutate } = createListMutation;
  const { refetch: refetchFavorites } = favoritesQuery;

  const addToList = useCallback(
    async (vehicleId: string, listId: string) => {
      await addToListMutate({ vehicleId, listId });
    },
    [addToListMutate],
  );

  const removeFromList = useCallback(
    async (vehicleId: string, listId: string) => {
      await removeFromListMutate({ vehicleId, listId });
    },
    [removeFromListMutate],
  );

  const toggleListMembership = useCallback(
    async (vehicleId: string, listId: string, checked: boolean) => {
      if (checked) {
        await addToList(vehicleId, listId);
        return;
      }
      await removeFromList(vehicleId, listId);
    },
    [addToList, removeFromList],
  );

  const createList = useCallback(
    (input: CreateFavoriteListInput) => createListMutate(input),
    [createListMutate],
  );

  const isFavorite = useCallback(
    (vehicleId: string) => favoriteIds.has(vehicleId),
    [favoriteIds],
  );

  const getListIdsForVehicle = useCallback(
    (vehicleId: string) => membershipByVehicle.get(vehicleId) ?? EMPTY_MEMBERSHIP,
    [membershipByVehicle],
  );

  const resolveDefaultList = useCallback(
    () => resolveDefaultVehicleList(lists),
    [lists],
  );

  const refetch = useCallback(async () => {
    await refetchFavorites();
  }, [refetchFavorites]);

  const value = useMemo(
    () => ({
      lists,
      favoriteIds,
      isLoading: isAuthenticated && favoritesQuery.isLoading,
      isFetching: isAuthenticated && favoritesQuery.isFetching,
      isFavorite,
      getListIdsForVehicle,
      addToList,
      removeFromList,
      toggleListMembership,
      createList,
      isCreatingList: createListMutation.isPending,
      creatingVehicleId: createListMutation.isPending
        ? (createListMutation.variables?.vehicleId ?? null)
        : null,
      pendingKeys,
      resolveDefaultList,
      refetch,
    }),
    [
      lists,
      favoriteIds,
      isAuthenticated,
      favoritesQuery.isLoading,
      favoritesQuery.isFetching,
      isFavorite,
      getListIdsForVehicle,
      addToList,
      removeFromList,
      toggleListMembership,
      createList,
      createListMutation.isPending,
      createListMutation.variables?.vehicleId,
      pendingKeys,
      resolveDefaultList,
      refetch,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
};
