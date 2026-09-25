import { apiGet, type ApiResponse } from "@/lib/api";
import type { Vehicle } from "@/interfaces/vehicle.interface";
import type { VehicleInsights } from "@/interfaces/vehicle-insights.interface";
import { vehiclesService } from "@/components/vehicles/services/vehiclesService";
import { vehicleInsightsPath } from "./vehicle-insights.routes";

export class VehicleInsightsAccessError extends Error {
  readonly status = 403;

  constructor() {
    super("No tienes acceso al diagnóstico de anuncios.");
    this.name = "VehicleInsightsAccessError";
  }
}

export const vehicleInsightsService = {
  async getInsights(vehicleId: string): Promise<VehicleInsights> {
    const response = await apiGet<VehicleInsights>(
      vehicleInsightsPath(vehicleId),
    );
    if (response.status === 403) {
      throw new VehicleInsightsAccessError();
    }
    if (!response.ok) {
      throw new Error(
        response.message || "No se pudo cargar el diagnóstico del anuncio",
      );
    }
    return response.data;
  },

  async updatePrice(
    vehicleId: string,
    price: number,
  ): Promise<ApiResponse<Vehicle>> {
    return vehiclesService.update(vehicleId, { price });
  },
};
