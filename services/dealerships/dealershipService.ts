import { apiGet } from "@/lib/api";
import { objectToQueryString } from "@/lib/utils";
import type { PaginatedResult, PaginationParams } from "@/types/general.types";
import { V1_DEALERSHIPS } from "./route.constants";
import type { DealershipListItem } from "./types/dealership.types";

export type FindAllDealershipsParams = PaginationParams & {
  query?: string;
  province_slug?: string;
  radius?: number;
  rating_since?: number;
  vehicles_number?: number;
  is_featured?: boolean;
  sort?: string;
};

const mapSortToOrder = (
  sort?: string,
): Pick<PaginationParams, "order_by" | "order_direction"> => {
  switch (sort) {
    case "rating-desc":
      return { order_by: "rating", order_direction: "DESC" };
    case "vehicles-desc":
      return { order_by: "vehicles_count", order_direction: "DESC" };
    case "reviews-desc":
      return { order_by: "reviews_count", order_direction: "DESC" };
    case "distance-asc":
      return { order_by: "distance", order_direction: "ASC" };
    default:
      return {};
  }
};

export const dealershipService = {
  findAll: async (
    params?: FindAllDealershipsParams,
  ): Promise<PaginatedResult<DealershipListItem>> => {
    const input: FindAllDealershipsParams = params
      ? params
      : { page: 1, limit: 12 };
    const { sort, ...rest } = input;
    const order = mapSortToOrder(sort);

    const merged: Record<string, string | number | boolean | undefined> = {
      page: rest.page ?? 1,
      limit: rest.limit ?? 12,
      query: rest.query,
      province_slug: rest.province_slug,
      radius: rest.radius,
      rating_since: rest.rating_since,
      vehicles_number: rest.vehicles_number,
      is_featured: rest.is_featured,
      order_by: rest.order_by ?? order.order_by,
      order_direction: rest.order_direction ?? order.order_direction,
    };

    const query_string = objectToQueryString(merged);
    const response = await apiGet<PaginatedResult<DealershipListItem>>(
      `${V1_DEALERSHIPS}${query_string ? `?${query_string}` : ""}`,
    );
    return response.data;
  },
};
