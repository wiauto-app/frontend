import { apiGet } from "@/lib/api";
import { objectToQueryString } from "@/lib/utils";
import type { PaginatedResult } from "@/types/general.types";
import { V1_MUNICIPALITIES } from "./route.constants";
import type {
  FindAllMunicipalitiesParams,
  MunicipalityCatalogItem,
} from "./types/municipality.types";

export const municipalitiesCatalogService = {
  findAll: async (
    params?: FindAllMunicipalitiesParams,
  ): Promise<PaginatedResult<MunicipalityCatalogItem>> => {
    const merged = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      order_by: params?.order_by,
      order_direction: params?.order_direction,
      search: params?.search,
      province_slug: params?.province_slug,
    };
    const query_string = objectToQueryString(merged);
    const response = await apiGet<PaginatedResult<MunicipalityCatalogItem>>(
      `${V1_MUNICIPALITIES}${query_string ? `?${query_string}` : ""}`,
      undefined,
      60,
    );
    return (
      response.data ?? {
        data: [],
        total: 0,
        page: merged.page,
        limit: merged.limit,
      }
    );
  },
};
