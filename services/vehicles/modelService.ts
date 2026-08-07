import {
  SearchModelItem,
  SearchModelsResponse,
} from "@/interfaces/catalog-search.interface";
import { PaginatedResponse } from "@/interfaces/vehicle.interface";
import { apiGet } from "@/lib/api";
import { V1_CATALOG_MODELS } from "./route.constants";
import qs from "qs";

export interface SearchModelsParams {
  make_id: number;
  search?: string;
  province_id?: string;
  since_price?: number;
  until_price?: number;
  page?: number;
  limit?: number;
}

export interface FindModelsByMakeParams {
  make_id: number;
  page?: number;
  limit?: number;
  query?: string;
  search?: string;
}

export interface FindAllModelsParams {
  make_id: number;
  page?: number;
  limit?: number;
  search?: string;
  order_by?: string;
  order_direction?: "ASC" | "DESC";
}

export const modelService = {
  search: async (params: SearchModelsParams): Promise<SearchModelItem[]> => {
    const query = qs.stringify(params, {
      skipNulls: true,
      addQueryPrefix: true,
    });
    const response = await apiGet<SearchModelsResponse>(
      `${V1_CATALOG_MODELS}/search${query}`,
    );
    return response.data?.models ?? [];
  },
  findAll: async (
    params: FindAllModelsParams,
  ): Promise<PaginatedResponse<SearchModelItem>> => {
    const query = qs.stringify(
      {
        make_id: params.make_id,
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search,
        order_by: params.order_by,
        order_direction: params.order_direction,
      },
      { skipNulls: true, addQueryPrefix: true },
    );
    const response = await apiGet<PaginatedResponse<SearchModelItem>>(
      `${V1_CATALOG_MODELS}${query}`,
    );
    return response.data ?? { data: [], total: 0, page: 1, limit: 10 };
  },
  findByMakeId: async (
    params: FindModelsByMakeParams,
  ): Promise<SearchModelItem[]> => {
    const query = qs.stringify(
      { ...params, limit: params.limit ?? 100 },
      { skipNulls: true, addQueryPrefix: true },
    );
    const response = await apiGet<PaginatedResponse<SearchModelItem>>(
      `${V1_CATALOG_MODELS}${query}`,
    );
    return response.data?.data ?? [];
  },
};
