import { cookies } from "next/headers";

import { API_URL } from "@/constants";
import type { ActiveFiltersResponse } from "@/interfaces/active-filters.interface";
import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";
import { buildVehiclesQueryString } from "@/lib/vehicles/build-vehicles-query-params";

const empty_active_filters: ActiveFiltersResponse = {
  resolved: {
    vehicle_type: null,
    makes: [],
    models: [],
    provinces: [],
    communities: [],
    municipalities: [],
    services: [],
    warranties: [],
    colors: [],
    dgt_labels: [],
    features: [],
    fuels: [],
    tractions: [],
    cuotas: [],
  },
  applied: {},
};

export const activeFiltersService = {
  async getActiveFilters(
    params: FindAllVehiclesParams,
  ): Promise<ActiveFiltersResponse> {
    if (!API_URL) {
      return empty_active_filters;
    }

    const token = (await cookies()).get("access_token")?.value;
    const query = buildVehiclesQueryString(params);

    try {
      const response = await fetch(`${API_URL}/v1/filters/active${query}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      });

      if (!response.ok) {
        return empty_active_filters;
      }

      const body = (await response.json()) as {
        data?: ActiveFiltersResponse;
      };

      return body.data ?? empty_active_filters;
    } catch {
      return empty_active_filters;
    }
  },
};
