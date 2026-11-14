import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  type ApiResponse,
} from "@/lib/api";
import { objectToQueryString } from "@/lib/utils";
import type { PaginatedResult, PaginationParams } from "@/types/general.types";
import { catalogSelectorNameOrder } from "@/lib/catalog-selector-order";
import type {
  CategoryItem,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types/category.types";
import { V1_CATEGORIES } from "./route.constants";

const SELECTOR_PAGE_SIZE = 100;
const SELECTOR_MAX_PAGES = 5;

export const categoriesService = {
  findAll: async (
    params?: PaginationParams,
  ): Promise<PaginatedResult<CategoryItem>> => {
    const merged = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      order_by: params?.order_by,
      order_direction: params?.order_direction,
      search: params?.search,
    };
    const query_string = objectToQueryString(merged);
    const response = await apiGet<PaginatedResult<CategoryItem>>(
      `${V1_CATEGORIES}${query_string ? `?${query_string}` : ""}`,
    );
    return response.data;
  },

  /** Catálogo completo para selectores (varias páginas si `total` > `limit`). */
  findAllForSelector: async (): Promise<PaginatedResult<CategoryItem>> => {
    const accumulated: CategoryItem[] = [];
    let page = 1;
    let total = 0;
    let limit = SELECTOR_PAGE_SIZE;

    while (page <= SELECTOR_MAX_PAGES) {
      const batch = await categoriesService.findAll({
        page,
        limit: SELECTOR_PAGE_SIZE,
        ...catalogSelectorNameOrder,
      });

      accumulated.push(...batch.data);
      total = batch.total;
      limit = batch.limit;

      if (batch.data.length === 0) {
        break;
      }

      if (accumulated.length >= batch.total) {
        break;
      }

      page += 1;
    }

    return {
      data: accumulated,
      total: total || accumulated.length,
      page: 1,
      limit: limit || accumulated.length || SELECTOR_PAGE_SIZE,
    };
  },

  findOne: async (id: string): Promise<ApiResponse<CategoryItem>> => {
    return apiGet<CategoryItem>(`${V1_CATEGORIES}/${id}`);
  },

  create: async (
    payload: CreateCategoryPayload,
  ): Promise<ApiResponse<CategoryItem>> => {
    return apiPost<CategoryItem>(V1_CATEGORIES, payload);
  },

  update: async (
    payload: UpdateCategoryPayload,
  ): Promise<ApiResponse<CategoryItem>> => {
    return apiPatch<CategoryItem>(V1_CATEGORIES, payload);
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiDelete<void>(`${V1_CATEGORIES}/${id}`);
  },
};
