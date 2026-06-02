import {
  SearchMakeItem,
  SearchMakesResponse,
} from "@/interfaces/catalog-search.interface";
import { PaginatedResponse, Make } from "@/interfaces/vehicle.interface";
import { apiGet } from "@/lib/api";
import { V1_CATALOG_MAKES } from "./route.constants";
import qs from "qs";

export interface SearchMakesParams {
  search?: string;
  province_id?: string;
  since_price?: number;
  until_price?: number;
  page?: number;
  limit?: number;
}

export const makeService = {
  findAll: async (): Promise<PaginatedResponse<Make>> => {
    const response = await apiGet<PaginatedResponse<Make>>(
      `${V1_CATALOG_MAKES}`,
    );
    return response.data ?? { data: [], total: 0, page: 1, limit: 10 };
  },
  search: async (params: SearchMakesParams): Promise<SearchMakeItem[]> => {
    const query = qs.stringify(params, {
      skipNulls: true,
      addQueryPrefix: true,
    });
    const response = await apiGet<SearchMakesResponse>(
      `${V1_CATALOG_MAKES}/search${query}`,
    );
    return response.data?.makes ?? [];
  },
};
