import { apiPost, type ApiResponse } from "@/lib/api";
import type {
  Alert,
  CreateAlertFromVehiclePayload,
} from "@/interfaces/alert.interface";

export const alertService = {
  createFromVehicle: (
    vehicleId: string,
    payload?: CreateAlertFromVehiclePayload,
  ): Promise<ApiResponse<Alert>> =>
    apiPost<Alert>(`/v1/alerts/from-vehicle/${vehicleId}`, payload ?? {}),
};
