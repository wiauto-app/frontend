import { Make, PaginatedResponse } from "@/interfaces/vehicle.interface";
import { apiGet, ApiResponse } from "@/lib/api";
import { V1_CATALOG_MAKES } from "./route.constants";



export const makeService = {
  findAll: async (): Promise<PaginatedResponse<Make>> => {
    const response = await apiGet<ApiResponse<PaginatedResponse<Make>>>(V1_CATALOG_MAKES);
    return response.data ?? [];
  },
};