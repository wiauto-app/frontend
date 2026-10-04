import type { VehicleListFavoritesSnapshot } from "@/interfaces/vehicle-list-favorites.interface";
import type { VehicleList } from "@/interfaces/vehicle-list.interface";

export const EMPTY_FAVORITES_SNAPSHOT: VehicleListFavoritesSnapshot = {
  lists: [],
  memberships: [],
};

export const favoritePendingKey = (vehicleId: string, listId: string) =>
  `${vehicleId}:${listId}`;

export const resolveDefaultVehicleList = (
  lists: VehicleList[],
): VehicleList | undefined =>
  lists.find((list) => list.is_default) ??
  lists.find((list) => list.name === "Favoritos");

const withListCount = (
  lists: VehicleList[],
  listId: string,
  delta: number,
): VehicleList[] =>
  lists.map((list) =>
    list.id === listId
      ? { ...list, item_count: Math.max(0, (list.item_count ?? 0) + delta) }
      : list,
  );

export const applyAddToList = (
  snapshot: VehicleListFavoritesSnapshot,
  vehicleId: string,
  listId: string,
): VehicleListFavoritesSnapshot => {
  const membership = snapshot.memberships.find(
    (item) => item.vehicle_id === vehicleId,
  );

  if (membership?.list_ids.includes(listId)) {
    return snapshot;
  }

  const memberships = membership
    ? snapshot.memberships.map((item) =>
        item.vehicle_id === vehicleId
          ? { ...item, list_ids: [...item.list_ids, listId] }
          : item,
      )
    : [
        ...snapshot.memberships,
        { vehicle_id: vehicleId, list_ids: [listId] },
      ];

  return {
    lists: withListCount(snapshot.lists, listId, 1),
    memberships,
  };
};

export const applyRemoveFromList = (
  snapshot: VehicleListFavoritesSnapshot,
  vehicleId: string,
  listId: string,
): VehicleListFavoritesSnapshot => {
  const membership = snapshot.memberships.find(
    (item) => item.vehicle_id === vehicleId,
  );

  if (!membership?.list_ids.includes(listId)) {
    return snapshot;
  }

  const listIds = membership.list_ids.filter((id) => id !== listId);
  const memberships =
    listIds.length === 0
      ? snapshot.memberships.filter((item) => item.vehicle_id !== vehicleId)
      : snapshot.memberships.map((item) =>
          item.vehicle_id === vehicleId
            ? { ...item, list_ids: listIds }
            : item,
        );

  return {
    lists: withListCount(snapshot.lists, listId, -1),
    memberships,
  };
};

export const applyCreateList = (
  snapshot: VehicleListFavoritesSnapshot,
  input: {
    tempId: string;
    vehicleId: string;
    name: string;
    description?: string;
  },
): VehicleListFavoritesSnapshot => {
  const description = input.description?.trim() ? input.description.trim() : null;
  const list: VehicleList = {
    id: input.tempId,
    profile_id: snapshot.lists[0]?.profile_id ?? "",
    is_default: false,
    name: input.name,
    description,
    created_at: new Date().toISOString(),
    item_count: 0,
  };

  return applyAddToList(
    { ...snapshot, lists: [...snapshot.lists, list] },
    input.vehicleId,
    input.tempId,
  );
};

export const replaceOptimisticListId = (
  snapshot: VehicleListFavoritesSnapshot,
  tempId: string,
  createdList: VehicleList,
): VehicleListFavoritesSnapshot => ({
  lists: snapshot.lists.map((list) =>
    list.id === tempId
      ? {
          ...createdList,
          item_count: Math.max(createdList.item_count ?? 0, list.item_count),
        }
      : list,
  ),
  memberships: snapshot.memberships.map((membership) => ({
    ...membership,
    list_ids: membership.list_ids.map((id) =>
      id === tempId ? createdList.id : id,
    ),
  })),
});
