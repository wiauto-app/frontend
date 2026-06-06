import { apiGet } from "@/lib/api";
import { Category, PaginatedResponse } from "@/interfaces/vehicle.interface";

const CATEGORIES_URL = `/v1/categories`;


export const categoriesService = {
  findAll: async (): Promise<PaginatedResponse<Category>> => {
    const response = await apiGet<PaginatedResponse<Category>>(CATEGORIES_URL);
    return response.data ?? [];
  },
};