import { apiDelete, apiGet, apiPost, type ApiResponse } from "@/lib/api";
import type {
  DismissedVehicle,
  DismissedVehicleItem,
  VehicleEngagementStatus,
  VehiclePriceWatch,
} from "@/interfaces/vehicle-engagement.interface";

export const VEHICLE_ENGAGEMENT_STATUS_QUERY_KEY = (
  vehicleId: string,
) => ["vehicle-engagement-status", vehicleId] as const;

export const DISMISSED_VEHICLES_QUERY_KEY = ["dismissed-vehicles"] as const;

const isActiveResource = <T>(response: ApiResponse<T>): boolean =>
  response.ok && response.status !== 404 && response.data != null;

const normalizeDismissedVehicles = (
  payload: unknown,
): DismissedVehicleItem[] => {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map((entry) => {
    if (typeof entry !== "object" || entry === null) {
      return {
        id: "",
        vehicle_id: "",
        created_at: "",
        vehicle: null,
      };
    }

    const record = entry as Record<string, unknown>;
    const vehicleId =
      typeof record.vehicle_id === "string"
        ? record.vehicle_id
        : typeof record.id === "string" && !record.vehicle
          ? record.id
          : "";

    return {
      id: typeof record.id === "string" ? record.id : vehicleId,
      vehicle_id: vehicleId,
      created_at:
        typeof record.created_at === "string" ? record.created_at : "",
      vehicle:
        record.vehicle && typeof record.vehicle === "object"
          ? (record.vehicle as DismissedVehicleItem["vehicle"])
          : null,
    };
  });
};

export const vehicleEngagementService = {
  activatePriceWatch: (
    vehicleId: string,
  ): Promise<ApiResponse<VehiclePriceWatch>> =>
    apiPost<VehiclePriceWatch>(`/v1/vehicles/${vehicleId}/price-watch`, {}),

  deactivatePriceWatch: (
    vehicleId: string,
  ): Promise<ApiResponse<null>> =>
    apiDelete(`/v1/vehicles/${vehicleId}/price-watch`),

  dismissVehicle: (
    vehicleId: string,
  ): Promise<ApiResponse<DismissedVehicle>> =>
    apiPost<DismissedVehicle>(`/v1/vehicles/${vehicleId}/dismiss`, {}),

  restoreDismissedVehicle: (
    vehicleId: string,
  ): Promise<ApiResponse<null>> =>
    apiDelete(`/v1/vehicles/${vehicleId}/dismiss`),

  /**
   * Estado opcional (GET del mismo recurso).
   * 404 / fallo → no activo. Compatible si el backend aún no expone GET.
   */
  getStatus: async (
    vehicleId: string,
  ): Promise<VehicleEngagementStatus> => {
    const [watchResponse, dismissResponse] = await Promise.all([
      apiGet<VehiclePriceWatch>(`/v1/vehicles/${vehicleId}/price-watch`),
      apiGet<DismissedVehicle>(`/v1/vehicles/${vehicleId}/dismiss`),
    ]);

    return {
      isWatchingPrice: isActiveResource(watchResponse),
      isDismissed: isActiveResource(dismissResponse),
    };
  },

  findDismissedVehicles: async (): Promise<
    ApiResponse<DismissedVehicleItem[]>
  > => {
    const response = await apiGet<unknown>("/v1/dismissed-vehicles");

    if (!response.ok) {
      return {
        ...response,
        data: [],
      };
    }

    return {
      ...response,
      data: normalizeDismissedVehicles(response.data),
    };
  },
};
