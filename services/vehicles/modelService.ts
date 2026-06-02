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
