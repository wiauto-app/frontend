import { apiGet } from "@/lib/api";
import { objectToQueryString } from "@/lib/utils";
import type { PaginatedResult, PaginationParams } from "@/types/general.types";
import { V1_DEALERSHIPS } from "./route.constants";
import type { DealershipListItem } from "./types/dealership.types";

export const dealershipService = {
  findAll: async (
    params?: PaginationParams,
  ): Promise<PaginatedResult<DealershipListItem>> => {
    const merged = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 8,
      order_by: params?.order_by,
      order_direction: params?.order_direction,
      search: params?.search,
    };
    const query_string = objectToQueryString(merged);
    const response = await apiGet<PaginatedResult<DealershipListItem>>(
      `${V1_DEALERSHIPS}${query_string ? `?${query_string}` : ""}`,
    );
    return response.data;
  },
};
