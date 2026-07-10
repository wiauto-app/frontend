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

export interface FindAllMakesParams {
  page?: number;
  limit?: number;
  order_by?: string;
  order_direction?: "ASC" | "DESC";
  search?: string;
}

export const makeService = {
  findAll: async (
    params?: FindAllMakesParams,
  ): Promise<PaginatedResponse<Make>> => {
    const query = qs.stringify(
      {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        order_by: params?.order_by,
        order_direction: params?.order_direction,
        search: params?.search,
      },
      { skipNulls: true, addQueryPrefix: true },
    );
    const response = await apiGet<PaginatedResponse<Make>>(
      `${V1_CATALOG_MAKES}${query}`,
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
