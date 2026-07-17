import { TransmissionType } from "@/interfaces/vehicle.interface";
import { apiPost, type ApiResponse } from "@/lib/api";

export interface VehicleIdentificationLookupRequest {
  plate?: string;
  vin?: string;
  country?: string;
}

export interface ApiVehicleResponse {
  version_id: number;
  catalog_make_id: number;
  catalog_model_id: number;
  catalog_year_id: number;
  power: number | null;
  displacement: string | number | null;
  traction_id: string;
  transmission_type: TransmissionType;
  vin: string | null;
  license_plate: string | null;
}

export const VEHICLE_IDENTIFICATION_RATE_LIMIT_MESSAGE =
  "Has alcanzado el límite de búsquedas. Espera un momento e inténtalo de nuevo.";

export const VEHICLE_IDENTIFICATION_NOT_FOUND_MESSAGE =
  "No encontramos un vehículo con esos datos. Revisa la matrícula o el VIN e inténtalo de nuevo.";

export const VEHICLE_IDENTIFICATION_GENERIC_ERROR_MESSAGE =
  "No se pudo completar la búsqueda. Inténtalo de nuevo más tarde.";

export const isVehicleIdentificationRateLimited = (
  response: ApiResponse<unknown>,
): boolean => response.status === 429;

export const isVehicleIdentificationNotFound = (
  response: ApiResponse<unknown>,
): boolean => response.status === 404;

/** Extrae cc numéricos de valores como "1896 CM3" o 1896. */
export const parseDisplacementCc = (
  value: string | number | null | undefined,
): number | undefined => {
  if (value == null || value === "") {
    return undefined;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }
  const match = String(value).match(/(\d+(?:[.,]\d+)?)/);
  if (!match) {
    return undefined;
  }
  const parsed = Number(match[1].replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const vehicleIdentificationService = {
  lookup: async (
    body: VehicleIdentificationLookupRequest,
  ): Promise<ApiResponse<ApiVehicleResponse>> =>
    apiPost<ApiVehicleResponse>(
      "/v1/vehicles/identification/lookup",
      body,
    ),
};
