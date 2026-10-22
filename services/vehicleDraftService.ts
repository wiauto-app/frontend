import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { apiDelete, apiGet, apiPut, type ApiResponse } from "@/lib/api";

const VEHICLE_DRAFT_ME_PATH = "/v1/vehicle-drafts/me";

export interface VehicleDraft {
  id: string;
  profile_id: string;
  values: Partial<QuickVehicleSchema>;
  step: number | null;
  appraisal_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SaveVehicleDraftPayload {
  values: Partial<QuickVehicleSchema>;
  step?: number | null;
  appraisal_id?: string | null;
}

export const vehicleDraftService = {
  getMine: (): Promise<ApiResponse<VehicleDraft | null>> =>
    apiGet<VehicleDraft | null>(VEHICLE_DRAFT_ME_PATH),

  saveMine: (
    payload: SaveVehicleDraftPayload,
  ): Promise<ApiResponse<VehicleDraft>> =>
    apiPut<VehicleDraft>(VEHICLE_DRAFT_ME_PATH, payload),

  removeMine: (): Promise<ApiResponse<null>> =>
    apiDelete(VEHICLE_DRAFT_ME_PATH),
};
