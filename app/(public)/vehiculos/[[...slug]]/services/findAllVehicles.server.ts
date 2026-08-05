
import { API_URL } from "@/constants";
import type {
  FindAllVehiclesParams,
  PaginatedResponse,
  VehicleListItem,
} from "@/interfaces/vehicle.interface";
import { buildVehiclesQueryString } from "@/lib/vehicles/build-vehicles-query-params";
import { CACHE_ONE_HOUR, CACHE_TAGS } from "@/constants/cache.constants";

export interface VehiclesListingResult {
  vehicles: VehicleListItem[];
  total: number;
  page: number;
  limit: number;
}

export const findAllVehicles = async (
  params: FindAllVehiclesParams,
): Promise<VehiclesListingResult> => {
  const empty: VehiclesListingResult = {
    vehicles: [],
    total: 0,
    page: params.page ?? 1,
    limit: params.limit ?? 12,
  };


  const query = buildVehiclesQueryString(params);

  try {
    const response = await fetch(`${API_URL}/v1/vehicles${query}`, {
      next: {
        revalidate: CACHE_ONE_HOUR,
        tags: [CACHE_TAGS.VEHICLES],
      }
    });

    if (!response.ok) {
      return empty;
    }

    const body = (await response.json()) as {
      data?: PaginatedResponse<VehicleListItem>;
    };

    const payload = body.data;

    return {
      vehicles: payload?.data ?? [],
      total: payload?.total ?? 0,
      page: payload?.page ?? empty.page,
      limit: payload?.limit ?? empty.limit,
    };
  } catch {
    return empty;
  }
};
