import { apiDelete, apiGet, type ApiResponse } from "@/lib/api";
import type { VehicleSearchHistoryItem } from "@/interfaces/vehicle-search-history.interface";

export const VEHICLE_SEARCH_HISTORY_QUERY_KEY = [
  "vehicle-search-history",
] as const;

/** Máximo aceptado por el backend. */
export const VEHICLE_SEARCH_HISTORY_MAX_LIMIT = 50;

const BASE_PATH = "/v1/vehicles/search-history";

export const vehicleSearchHistoryService = {
  findAll: (
    limit = 20,
  ): Promise<ApiResponse<VehicleSearchHistoryItem[]>> =>
    apiGet<VehicleSearchHistoryItem[]>(BASE_PATH, {
      limit: Math.min(Math.max(1, limit), VEHICLE_SEARCH_HISTORY_MAX_LIMIT),
    }),

  remove: (id: string): Promise<ApiResponse<null>> =>
    apiDelete(`${BASE_PATH}/${encodeURIComponent(id)}`),

  clear: (): Promise<ApiResponse<null>> => apiDelete(BASE_PATH),
};
