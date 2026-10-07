import { apiGet } from "@/lib/api";
import { objectToQueryString } from "@/lib/utils";
import type { PaginatedResult, PaginationParams } from "@/types/general.types";
import { V1_COMMUNITIES } from "./route.constants";
import type { CommunityCatalogItem } from "./types/community.types";

export interface FindCommunitiesParams extends PaginationParams {
  search?: string;
}

export const communitiesCatalogService = {
  findAll: async (
    params?: FindCommunitiesParams,
  ): Promise<PaginatedResult<CommunityCatalogItem>> => {
    const merged = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      order_by: params?.order_by,
      order_direction: params?.order_direction,
      search: params?.search,
    };
    const query_string = objectToQueryString(merged);
    const response = await apiGet<PaginatedResult<CommunityCatalogItem>>(
      `${V1_COMMUNITIES}${query_string ? `?${query_string}` : ""}`,
      undefined,
      60,
    );
    return response.data;
  },
};
