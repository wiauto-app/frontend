import { ENVIRONMENT } from "@/constants";
import type {
  FindAllVehiclesParams,
  VehicleListItem,
} from "@/interfaces/vehicle.interface";
import { apiGet } from "@/lib/api";
import { CACHE_ONE_HOUR } from "@/constants/cache.constants";

export interface VehiclesListingResult {
  data: VehicleListItem[];
  total: number;
  page: number;
  limit: number;
}

export const findAllVehicles = async (
  params: FindAllVehiclesParams,
): Promise<VehiclesListingResult> => {
  const empty: VehiclesListingResult = {
    data: [],
    total: 0,
    page: params.page ?? 1,
    limit: params.limit ?? 30,
  };



  try {
    const response = await apiGet<VehiclesListingResult>("/v1/vehicles", {
      params,
    }, ENVIRONMENT === "development" ? 0 : CACHE_ONE_HOUR);
    if (!response.ok) {
      return empty;
    }

    const payload = response.data;

    return payload;
  } catch {
    return empty;
  }
};
