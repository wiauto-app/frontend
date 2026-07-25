import type { SearchVehiclesInput } from "@/interfaces/search-vehicles.interface";
import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

const SEARCH_FILTER_KEYS = [
  "type_slug",
  "makes_slugs",
  "models_slugs",
  "since_price",
  "until_price",
  "price_offer",
  "service_slugs",
  "provinces_slugs",
  "comunities_slugs",
  "municipalities_slugs",
  "lat",
  "lng",
  "radius",
  "publisher_types",
  "is_seller_featured",
  "warranty_slugs",
  "since_year",
  "until_year",
  "since_mileage",
  "until_mileage",
  "transmission_types",
  "fuel_type_slugs",
  "traction_slugs",
  "power_since",
  "power_until",
  "displacement_since",
  "displacement_until",
  "dgt_label_ids",
  "autonomy_since",
  "battery_capacity_since",
  "battery_capacity_until",
  "time_to_charge",
  "features_slugs",
  "color_slugs",
  "cuota_slugs",
  "exclude_vehicle_ids",
  "dealership_ids",
] as const satisfies ReadonlyArray<keyof SearchVehiclesInput>;

const isEmptyFilterValue = (value: unknown): boolean => {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === "string" && value.trim() === "") {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
};

export const pickSearchFiltersFromListing = (
  filters: FindAllVehiclesParams,
): SearchVehiclesInput => {
  const result: SearchVehiclesInput = {};

  for (const key of SEARCH_FILTER_KEYS) {
    const value = filters[key as keyof FindAllVehiclesParams];
    if (isEmptyFilterValue(value)) {
      continue;
    }

    (result as Record<string, unknown>)[key] = value;
  }

  return result;
};
