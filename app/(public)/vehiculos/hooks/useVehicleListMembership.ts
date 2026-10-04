"use client";

import { useCallback, useMemo } from "react";

import { useFavorites } from "@/app/contexts/favorites/useFavorites";
import { favoritePendingKey } from "@/app/contexts/favorites/favoritesCache";

export { resolveDefaultVehicleList } from "@/app/contexts/favorites/favoritesCache";

interface UseVehicleListMembershipOptions {
  vehicleId: string;
  enabled?: boolean;
}

export const useVehicleListMembership = ({
  vehicleId,
  enabled = false,
}: UseVehicleListMembershipOptions) => {
  const {
    lists,
    isFavorite,
    getListIdsForVehicle,
    isLoading: isFavoritesLoading,
    isFetching: isFavoritesFetching,
    addToList,
    removeFromList,
    toggleListMembership: toggleFavoriteList,
    createList: createFavoriteList,
    creatingVehicleId,
    pendingKeys,
    resolveDefaultList,
    refetch,
  } = useFavorites();

  const membership = getListIdsForVehicle(vehicleId);
  const isFavorited = isFavorite(vehicleId);

  const pendingListIds = useMemo(() => {
    const ids = new Set<string>();
    for (const list of lists) {
      if (pendingKeys.has(favoritePendingKey(vehicleId, list.id))) {
        ids.add(list.id);
      }
    }
    return ids;
  }, [lists, pendingKeys, vehicleId]);

  const handleAddToList = useCallback(
    (listId: string) => addToList(vehicleId, listId),
    [addToList, vehicleId],
  );

  const handleRemoveFromList = useCallback(
    (listId: string) => removeFromList(vehicleId, listId),
    [removeFromList, vehicleId],
  );

  const handleToggleListMembership = useCallback(
    (listId: string, checked: boolean) =>
      toggleFavoriteList(vehicleId, listId, checked),
    [toggleFavoriteList, vehicleId],
  );

  const handleCreateList = useCallback(
    ({ name, description }: { name: string; description?: string }) =>
      createFavoriteList({ vehicleId, name, description }),
    [createFavoriteList, vehicleId],
  );

  return {
    lists,
    membership,
    isFavorited,
    isLoading: enabled && isFavoritesLoading,
    isFetching: enabled && isFavoritesFetching,
    addToList: handleAddToList,
    removeFromList: handleRemoveFromList,
    toggleListMembership: handleToggleListMembership,
    createList: handleCreateList,
    isCreatingList: creatingVehicleId === vehicleId,
    pendingListIds,
    resolveDefaultList,
    refetch,
  };
};
