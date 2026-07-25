import type {
  CreateAlertFilterFields,
  CreateAlertPayload,
} from "@/interfaces/alert.interface";
import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

const ALERT_FILTER_KEYS = [
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
] as const satisfies ReadonlyArray<keyof CreateAlertFilterFields>;

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

export const pickAlertFiltersFromListing = (
  filters: FindAllVehiclesParams,
): CreateAlertFilterFields => {
  const result: CreateAlertFilterFields = {};

  for (const key of ALERT_FILTER_KEYS) {
    const value = filters[key];
    if (isEmptyFilterValue(value)) {
      continue;
    }

    (result as Record<string, unknown>)[key] = value;
  }

  return result;
};

export const hasAlertFilters = (filters: FindAllVehiclesParams): boolean =>
  Object.keys(pickAlertFiltersFromListing(filters)).length > 0;

export const buildCreateAlertPayload = (params: {
  filters: FindAllVehiclesParams;
  email: string;
  phone: string;
  phone_code: string;
  name?: string;
}): CreateAlertPayload => {
  const name = params.name?.trim();

  return {
    ...pickAlertFiltersFromListing(params.filters),
    email: params.email.trim(),
    phone: params.phone.trim(),
    phone_code: params.phone_code.trim(),
    ...(name ? { name } : {}),
  };
};
