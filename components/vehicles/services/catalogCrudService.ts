import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  type ApiResponse,
} from "@/lib/api";
import { objectToQueryString } from "@/lib/utils";
import type { PaginatedResult, PaginationParams } from "@/types/general.types";

/**
 * CRUD estándar para recursos de catálogo de vehículos cuyo backend devuelve
 * la entidad anidada en `data` (p. ej. `{ traction: {...} }`, `{ dgt_label: {...} }`).
 */
export const createCatalogCrudService = <TRow extends object>(
  base_path: string,
  entity_response_key: string,
) => {
  const pickEntity = (
    response: ApiResponse<Record<string, unknown>>,
  ): ApiResponse<TRow> => {
    const envelope = response.data;
    const entity = envelope[entity_response_key];
    return {
      ...response,
      data: entity as TRow,
    };
  };

  return {
    findAll: async (
      params?: PaginationParams,
    ): Promise<PaginatedResult<TRow>> => {
      const merged = {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        order_by: params?.order_by,
        order_direction: params?.order_direction,
        search: params?.search,
      };
      const query_string = objectToQueryString(merged);
      const response = await apiGet<PaginatedResult<TRow>>(
        `${base_path}?${query_string}`,
      );
      return response.data;
    },

    findOne: async (id: string): Promise<ApiResponse<TRow>> => {
      const response = await apiGet<Record<string, unknown>>(
        `${base_path}/${id}`,
      );
      return pickEntity(response);
    },

    create: async (
      body: Record<string, unknown>,
    ): Promise<ApiResponse<TRow>> => {
      const response = await apiPost<Record<string, unknown>>(base_path, body);
      return pickEntity(response);
    },

    update: async (dto: {
      id: string;
      [key: string]: unknown;
    }): Promise<ApiResponse<TRow>> => {
      const { id, ...body } = dto;
      const response = await apiPatch<Record<string, unknown>>(
        `${base_path}/${id}`,
        body,
      );
      return pickEntity(response);
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      return apiDelete<void>(`${base_path}/${id}`);
    },
  };
};
