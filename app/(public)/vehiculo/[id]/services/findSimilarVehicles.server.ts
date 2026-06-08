import { cookies } from "next/headers";

import { API_URL } from "@/constants";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";

export type SimilarVehiclesListingParams = {
  makes_slugs: string[];
  models_slugs: string[];
};

export type SimilarVehiclesServerResult = {
  vehicles: VehicleListItem[];
  total: number;
  page: number;
  limit: number;
  listingParams: SimilarVehiclesListingParams | null;
};

type FindSimilarVehiclesOptions = {
  page?: number;
  limit?: number;
};

export const findSimilarVehicles = async (
  vehicleId: string,
  options: FindSimilarVehiclesOptions = {},
): Promise<SimilarVehiclesServerResult> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 4;

  const empty: SimilarVehiclesServerResult = {
    vehicles: [],
    total: 0,
    page,
    limit,
    listingParams: null,
  };

  if (!API_URL) {
    return empty;
  }

  const token = (await cookies()).get("access_token")?.value;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  try {
    const response = await fetch(
      `${API_URL}/v1/vehicles/${vehicleId}/similar?${query.toString()}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return empty;
    }

    const body = (await response.json()) as {
      data?: {
        data?: VehicleListItem[];
        total?: number;
        page?: number;
        limit?: number;
        listing_href_slugs?: {
          make?: string;
          model?: string;
        };
      };
    };

    const payload = body.data;
    const make_slug = payload?.listing_href_slugs?.make;
    const model_slug = payload?.listing_href_slugs?.model;

    return {
      vehicles: payload?.data ?? [],
      total: payload?.total ?? 0,
      page: payload?.page ?? page,
      limit: payload?.limit ?? limit,
      listingParams:
        make_slug && model_slug
          ? {
              makes_slugs: [make_slug],
              models_slugs: [model_slug],
            }
          : null,
    };
  } catch {
    return empty;
  }
};
