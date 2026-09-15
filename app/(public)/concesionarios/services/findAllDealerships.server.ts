import type { DealerSearchParams } from "../utils/dealerSearchParams";
import { dealershipService } from "@/services/dealerships/dealershipService";
import type { DealershipListItem } from "@/services/dealerships/types/dealership.types";

export type DealershipsListingResult = {
  dealers: DealershipListItem[];
  total: number;
  page: number;
  limit: number;
};

export const findAllDealershipsServer = async (
  params: DealerSearchParams,
): Promise<DealershipsListingResult> => {
  const result = await dealershipService.findAll({
    page: params.page ?? 1,
    limit: params.limit ?? 12,
    query: params.query,
    province_slug: params.province_slug,
    radius:
      params.radius != null && params.radius > 0
        ? params.radius * 1000
        : undefined,
    rating_since: params.rating_since,
    vehicles_number: params.vehicles_number,
    sort: params.sort,
  });

  return {
    dealers: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
};
