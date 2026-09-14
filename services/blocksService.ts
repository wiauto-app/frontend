import { apiDelete, apiGet, apiPost, type ApiResponse } from "@/lib/api";
import type {
  CreateUserBlockDto,
  UserBlockListItem,
} from "@/interfaces/block.interface";

export const BLOCKS_QUERY_KEY = ["user-blocks"] as const;

export const blocksService = {
  findAll: (): Promise<ApiResponse<UserBlockListItem[]>> =>
    apiGet<UserBlockListItem[]>("/v1/blocks"),

  create: (
    data: CreateUserBlockDto,
  ): Promise<ApiResponse<UserBlockListItem>> =>
    apiPost<UserBlockListItem>("/v1/blocks", data),

  remove: (
    blockedProfileId: string,
  ): Promise<ApiResponse<null>> =>
    apiDelete<null>(`/v1/blocks/${blockedProfileId}`),
};
