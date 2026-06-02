import { cookies } from "next/headers";

import { API_URL } from "@/constants";
import type {
  FindAllVehiclesParams,
  PaginatedResponse,
  VehicleListItem,
} from "@/interfaces/vehicle.interface";
import { buildVehiclesQueryString } from "@/lib/vehicles/build-vehicles-query-params";

export type VehiclesListingServerResult = {
  vehicles: VehicleListItem[];
  total: number;
  page: number;
  limit: number;
};

export const findAllVehicles = async (
  params: FindAllVehiclesParams,
): Promise<VehiclesListingServerResult> => {
  const empty: VehiclesListingServerResult = {
    vehicles: [],
    total: 0,
    page: params.page ?? 1,
    limit: params.limit ?? 12,
  };

  if (!API_URL) {
    return empty;
  }

  const token = (await cookies()).get("access_token")?.value;
  const query = buildVehiclesQueryString(params);

  try {
    const response = await fetch(`${API_URL}/v1/vehicles${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
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
