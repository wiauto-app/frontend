import { apiGet, apiPatch, apiPost, type ApiResponse } from "@/lib/api";
import type { Vehicle } from "@/interfaces/vehicle.interface";
import type { UpdateVehicleSchema, VehicleSchema } from "../types/vehicles.types";
import { V1_VEHICLES } from "./route.constants";
import { serializeVehiclePayload } from "../utils/serializeVehiclePayload";

export const vehiclesService = {
  async findOne(id: string): Promise<Vehicle> {
    const response = await apiGet<Vehicle>(`${V1_VEHICLES}/${id}`);
    if (!response.ok) {
      throw new Error(response.message || "No se pudo cargar el vehículo");
    }
    return response.data;
  },

  async create(data: VehicleSchema): Promise<ApiResponse<Vehicle>> {
    return apiPost<Vehicle>(V1_VEHICLES, data);
  },

  async update(
    id: string,
    data: UpdateVehicleSchema,
  ): Promise<ApiResponse<Vehicle>> {
    return apiPatch<Vehicle>(
      `${V1_VEHICLES}/${id}`,
      serializeVehiclePayload(data, {
        only_temp_images: true,
        is_update: true,
      }),
    );
  },
};
