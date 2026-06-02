import { FiltersResponse } from "@/interfaces/filters.interface";
import { apiGet } from "@/lib/api";

export const filtersService = {
  async getFilters(): Promise<FiltersResponse> {
    const response = await apiGet<FiltersResponse>("/v1/filters");
    return response.data;
  },
};