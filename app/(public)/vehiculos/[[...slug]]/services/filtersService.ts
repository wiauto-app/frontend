import type { ActiveFiltersResponse } from "@/interfaces/active-filters.interface";
import { FiltersResponse } from "@/interfaces/filters.interface";
import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";
import { apiGet } from "@/lib/api";

export const filtersService = {
  async getFilters(): Promise<FiltersResponse> {
    const response = await apiGet<FiltersResponse>("/v1/filters");
    return response.data;
  },

  /** Uso en cliente (p. ej. tras cambiar filtros sin recargar). En RSC usa `activeFiltersService`. */
  async getActiveFilters(
    params: FindAllVehiclesParams,
  ): Promise<ActiveFiltersResponse> {
    const response = await apiGet<ActiveFiltersResponse>(
      "/v1/filters/active",
      params as Record<string, unknown>,
    );
    return response.data;
  },
};