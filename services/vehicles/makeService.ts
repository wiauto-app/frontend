import { Make, PaginatedResponse } from "@/interfaces/vehicle.interface";
import { apiGet } from "@/lib/api";
import { V1_CATALOG_MAKES } from "./route.constants";



export const makeService = {
  findAll: async (): Promise<PaginatedResponse<Make>> => {
    const response = await apiGet<PaginatedResponse<Make>>(V1_CATALOG_MAKES);
    return response.data ?? { data: [], total: 0, page: 1, limit: 10 };
  },
};