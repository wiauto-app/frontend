import { apiGet } from "@/lib/api";
import type { VehicleListFavoritesSnapshot } from "@/interfaces/vehicle-list-favorites.interface";

export const favoritesService = {
  getSnapshot: () =>
    apiGet<VehicleListFavoritesSnapshot>("/v1/vehicle-lists/favorites"),
};
