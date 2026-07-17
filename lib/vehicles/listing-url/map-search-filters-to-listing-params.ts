import type { SearchVehiclesInput } from "@/interfaces/search-vehicles.interface";
import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import { buildVehicleListingHref } from "./build-listing-url";

const isMeaningfulFilterValue = (value: unknown): boolean => {
  if (value === undefined || value === null) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return !Number.isNaN(value);
  }

  if (typeof value === "boolean") {
    return true;
  }

  return true;
};

export const hasMeaningfulSearchFilters = (
  filters: SearchVehiclesInput,
): boolean =>
  Object.values(filters).some((value) => isMeaningfulFilterValue(value));

export const hasMeaningfulFilters = hasMeaningfulSearchFilters;

const cleanSearchFilters = (
  filters: SearchVehiclesInput,
): Partial<FindAllVehiclesParams> => {
  const cleaned: Partial<FindAllVehiclesParams> = {};

  (
    Object.entries(filters) as [keyof SearchVehiclesInput, unknown][]
  ).forEach(([key, value]) => {
    if (!isMeaningfulFilterValue(value)) {
      return;
    }

    (cleaned as Record<string, unknown>)[key] = value;
  });

  return cleaned;
};

export const mapSearchFiltersToListingParams = (
  message: string,
  filters: SearchVehiclesInput,
): FindAllVehiclesParams => {
  if (!hasMeaningfulSearchFilters(filters)) {
    const trimmed_message = message.trim();
    return trimmed_message ? { query: trimmed_message } : {};
  }

  return cleanSearchFilters(filters) as FindAllVehiclesParams;
};

export const buildAiSearchListingHref = (
  message: string,
  filters: SearchVehiclesInput,
): string =>
  buildVehicleListingHref(mapSearchFiltersToListingParams(message, filters));
