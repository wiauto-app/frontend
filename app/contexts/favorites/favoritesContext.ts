"use client";

import { createContext } from "react";

import type { VehicleList } from "@/interfaces/vehicle-list.interface";

export const VEHICLE_LIST_FAVORITES_QUERY_KEY = [
  "vehicle-list-favorites",
] as const;

export interface CreateFavoriteListInput {
  vehicleId: string;
  name: string;
  description?: string;
}

export interface FavoritesContextValue {
  lists: VehicleList[];
  favoriteIds: ReadonlySet<string>;
  isLoading: boolean;
  isFetching: boolean;
  isFavorite: (vehicleId: string) => boolean;
  getListIdsForVehicle: (vehicleId: string) => ReadonlySet<string>;
  addToList: (vehicleId: string, listId: string) => Promise<void>;
  removeFromList: (vehicleId: string, listId: string) => Promise<void>;
  toggleListMembership: (
    vehicleId: string,
    listId: string,
    checked: boolean,
  ) => Promise<void>;
  createList: (input: CreateFavoriteListInput) => Promise<VehicleList>;
  isCreatingList: boolean;
  creatingVehicleId: string | null;
  pendingKeys: ReadonlySet<string>;
  resolveDefaultList: () => VehicleList | undefined;
  refetch: () => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(
  null,
);
