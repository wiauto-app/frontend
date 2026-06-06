import { ApiResponse, apiPost } from "@/lib/api";
import type { RecordVehicleShareDto } from "@/interfaces/vehicle-list.interface";

export type VehicleShareRecord = {
  id: string;
  vehicle_id: string;
  profile_id: string | null;
  platform: string;
  source: string;
  created_at: string;
};

export const vehicleShareService = {
  record: (
    vehicleId: string,
    body: RecordVehicleShareDto,
  ): Promise<ApiResponse<VehicleShareRecord>> =>
    apiPost<VehicleShareRecord>(`/v1/vehicles/${vehicleId}/shares`, body),
};
