import { apiGet } from "@/lib/api";
import { objectToQueryString } from "@/lib/utils";
import type { PaginatedResult, PaginationParams } from "@/types/general.types";
import { V1_PROVINCES } from "./route.constants";
import type { ProvinceCatalogItem } from "./types/province.types";

export const provincesCatalogService = {
  findAll: async (
    params?: PaginationParams,
  ): Promise<PaginatedResult<ProvinceCatalogItem>> => {
    const merged = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      order_by: params?.order_by,
      order_direction: params?.order_direction,
      search: params?.search,
    };
    const query_string = objectToQueryString(merged);
    const response = await apiGet<PaginatedResult<ProvinceCatalogItem>>(
      `${V1_PROVINCES}${query_string ? `?${query_string}` : ""}`,
      undefined, 60
    );
    return response.data;
  },
};
