import { ApiResponse, apiGet } from "@/lib/api";
import type {
  VehiclePriceHistoryItem,
  VehiclePricesResponse,
} from "@/interfaces/vehicle-price.interface";

export const vehiclePriceService = {
  findByVehicleId: async (
    vehicleId: string,
  ): Promise<ApiResponse<VehiclePriceHistoryItem[]>> => {
    const response = await apiGet<VehiclePricesResponse>(
      `/v1/vehicles/${vehicleId}/prices`,
    );

    if (!response.ok) {
      return {
        ...response,
        data: [],
      };
    }

    return {
      ...response,
      data: response.data?.prices ?? [],
    };
  },
};
