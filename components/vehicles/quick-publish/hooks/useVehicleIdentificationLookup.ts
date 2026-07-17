"use client";

import { useState } from "react";
import {
  isVehicleIdentificationNotFound,
  isVehicleIdentificationRateLimited,
  vehicleIdentificationService,
  VEHICLE_IDENTIFICATION_GENERIC_ERROR_MESSAGE,
  VEHICLE_IDENTIFICATION_NOT_FOUND_MESSAGE,
  VEHICLE_IDENTIFICATION_RATE_LIMIT_MESSAGE,
  type ApiVehicleResponse,
} from "@/components/vehicles/services/vehicleIdentificationService";

export type VehicleIdentificationLookupError =
  | "not_found"
  | "rate_limited"
  | "generic";


export interface VehicleIdentificationLookupOutcome {
  data: ApiVehicleResponse | null;
  error: VehicleIdentificationLookupError | null;
}

const normalizePlate = (plate: string): string =>
  plate.replace(/\s+/g, "").toUpperCase();

const normalizeVin = (vin: string): string => vin.replace(/\s+/g, "").toUpperCase();

export const useVehicleIdentificationLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApiVehicleResponse | null>(
    null,
  );
  const [error, setError] = useState<VehicleIdentificationLookupError | null>(
    null,
  );

  const lookup = async (params: {
    plate?: string;
    vin?: string;
  }): Promise<VehicleIdentificationLookupOutcome> => {
    if (isLoading) {
      return { data: null, error: null };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await vehicleIdentificationService.lookup(params);
      if (isVehicleIdentificationRateLimited(response)) {
        setError("rate_limited");
        return { data: null, error: "rate_limited" };
      }

      if (isVehicleIdentificationNotFound(response)) {
        setError("not_found");
        return { data: null, error: "not_found" };
      }

      if (!response.ok || !response.data) {
        setError("generic");
        return { data: null, error: "generic" };
      }

      setResult(response.data);
      return { data: response.data, error: null };
    } catch {
      setError("generic");
      return { data: null, error: "generic" };
    } finally {
      setIsLoading(false);
    }
  };

  const lookupByLicensePlate = async (
    plate: string,
  ): Promise<VehicleIdentificationLookupOutcome> =>
    lookup({ plate: normalizePlate(plate) });

  const lookupByVin = async (
    vin: string,
  ): Promise<VehicleIdentificationLookupOutcome> =>
    lookup({ vin: normalizeVin(vin) });

  return {
    lookupByLicensePlate,
    lookupByVin,
    isLoading,
    result,
    error,
    errorMessages: {
      not_found: VEHICLE_IDENTIFICATION_NOT_FOUND_MESSAGE,
      rate_limited: VEHICLE_IDENTIFICATION_RATE_LIMIT_MESSAGE,
      generic: VEHICLE_IDENTIFICATION_GENERIC_ERROR_MESSAGE,
    } satisfies Record<VehicleIdentificationLookupError, string>,
  };
};
