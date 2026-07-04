import { apiPost, type ApiResponse } from "@/lib/api";
import type { QuickVehicleSchema } from "../schemas/quick-vehicle.schema";

export interface VehicleAiContext {
  version_id: number;
  catalog_make_id?: number;
  catalog_model_id?: number;
  catalog_year_id?: number;
  catalog_fuel_type_id?: number;
  condition: QuickVehicleSchema["condition"];
  mileage: number;
  transmission_type?: QuickVehicleSchema["transmission_type"];
  power?: number;
  displacement?: number;
  autonomy?: number;
  battery_capacity?: number;
  time_to_charge?: number;
  color_id?: string | null;
  category_id?: string | null;
  dgt_label_id?: string | null;
  traction_id?: string;
  lat: number;
  lng: number;
  vehicle_type_id: string;
  publisher_type: QuickVehicleSchema["publisher_type"];
}

export type VehicleAiPriceConfidence = "high" | "medium" | "low";

export type RecommendVehiclePriceSource = "platform" | "ai";

export interface RecommendVehiclePriceResponse {
  recommended_price: number;
  range_min: number;
  range_max: number;
  sample_count: number;
  explanation: string;
  confidence: VehicleAiPriceConfidence;
  source: RecommendVehiclePriceSource;
}

export interface GenerateVehicleDescriptionResponse {
  description: string;
}

export const VEHICLE_AI_RATE_LIMIT_MESSAGE =
  "Has alcanzado el límite de solicitudes. Espera un momento e inténtalo de nuevo.";

export const isVehicleAiRateLimited = (
  response: ApiResponse<unknown>,
): boolean => response.status === 429;

export const buildVehicleAiContext = (
  values: QuickVehicleSchema,
): VehicleAiContext => ({
  version_id: values.version_id,
  catalog_make_id: values.catalog_make_id,
  catalog_model_id: values.catalog_model_id,
  catalog_year_id: values.catalog_year_id,
  catalog_fuel_type_id: values.catalog_fuel_type_id,
  condition: values.condition,
  mileage: values.mileage,
  transmission_type: values.transmission_type,
  power: values.power,
  displacement: values.displacement,
  autonomy: values.autonomy,
  battery_capacity: values.battery_capacity,
  time_to_charge: values.time_to_charge,
  color_id: values.color_id,
  category_id: values.category_id,
  dgt_label_id: values.dgt_label_id,
  traction_id: values.traction_id,
  lat: values.lat,
  lng: values.lng,
  vehicle_type_id: values.vehicle_type_id,
  publisher_type: values.publisher_type,
});

export const vehicleAiService = {
  recommendPrice: async (
    context: VehicleAiContext,
  ): Promise<ApiResponse<RecommendVehiclePriceResponse>> =>
    apiPost<RecommendVehiclePriceResponse>(
      "/v1/vehicles/ai/recommend-price",
      context,
    ),

  generateDescription: async (
    context: VehicleAiContext,
  ): Promise<ApiResponse<GenerateVehicleDescriptionResponse>> =>
    apiPost<GenerateVehicleDescriptionResponse>(
      "/v1/vehicles/ai/generate-description",
      context,
    ),
};
