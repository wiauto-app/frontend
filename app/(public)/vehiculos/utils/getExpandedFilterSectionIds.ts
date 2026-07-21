import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

export const FILTER_SECTION_IDS = {
  VEHICLE_TYPE: "vehicle-type",
  CONDITION: "condition",
  MAKE_MODEL: "make-model",
  PRICE: "price",
  LOCATION: "location",
  SERVICES: "services",
  SELLERS: "sellers",
  YEAR: "year",
  MILEAGE: "mileage",
  ENGINE: "engine",
  DGT: "dgt",
  ELECTRIC: "electric",
  FEATURES: "features",
  COLOR: "color",
} as const;

export type FilterSectionId =
  (typeof FILTER_SECTION_IDS)[keyof typeof FILTER_SECTION_IDS];

const hasNonEmptyArray = <T>(value: T[] | undefined): boolean =>
  Array.isArray(value) && value.length > 0;

const hasNumber = (value: number | undefined): boolean =>
  value !== undefined && Number.isFinite(value);

export const getExpandedFilterSectionIds = (
  filters: FindAllVehiclesParams,
): FilterSectionId[] => {
  const open: FilterSectionId[] = [];

  if (filters.type_slug?.trim()) {
    open.push(FILTER_SECTION_IDS.VEHICLE_TYPE);
  }

  if (filters.condition) {
    open.push(FILTER_SECTION_IDS.CONDITION);
  }

  if (
    hasNonEmptyArray(filters.makes_slugs) ||
    hasNonEmptyArray(filters.models_slugs)
  ) {
    open.push(FILTER_SECTION_IDS.MAKE_MODEL);
  }

  if (
    hasNumber(filters.since_price) ||
    hasNumber(filters.until_price) ||
    hasNonEmptyArray(filters.cuota_slugs)
  ) {
    open.push(FILTER_SECTION_IDS.PRICE);
  }

  if (
    hasNonEmptyArray(filters.provinces_slugs) ||
    hasNonEmptyArray(filters.municipalities_slugs) ||
    hasNonEmptyArray(filters.comunities_slugs) ||
    (hasNumber(filters.lat) &&
      hasNumber(filters.lng) &&
      hasNumber(filters.radius))
  ) {
    open.push(FILTER_SECTION_IDS.LOCATION);
  }

  if (hasNonEmptyArray(filters.service_slugs)) {
    open.push(FILTER_SECTION_IDS.SERVICES);
  }

  if (hasNonEmptyArray(filters.publisher_types)) {
    open.push(FILTER_SECTION_IDS.SELLERS);
  }

  if (hasNumber(filters.since_year) || hasNumber(filters.until_year)) {
    open.push(FILTER_SECTION_IDS.YEAR);
  }

  if (hasNumber(filters.since_mileage) || hasNumber(filters.until_mileage)) {
    open.push(FILTER_SECTION_IDS.MILEAGE);
  }

  if (
    hasNonEmptyArray(filters.fuel_type_slugs) ||
    hasNonEmptyArray(filters.traction_slugs) ||
    hasNonEmptyArray(filters.transmission_types)
  ) {
    open.push(FILTER_SECTION_IDS.ENGINE);
  }

  if (hasNonEmptyArray(filters.dgt_label_ids)) {
    open.push(FILTER_SECTION_IDS.DGT);
  }

  if (
    hasNumber(filters.autonomy_since) ||
    hasNumber(filters.battery_capacity_since) ||
    hasNumber(filters.battery_capacity_until) ||
    hasNumber(filters.time_to_charge)
  ) {
    open.push(FILTER_SECTION_IDS.ELECTRIC);
  }

  if (hasNonEmptyArray(filters.features_slugs)) {
    open.push(FILTER_SECTION_IDS.FEATURES);
  }

  if (hasNonEmptyArray(filters.color_slugs)) {
    open.push(FILTER_SECTION_IDS.COLOR);
  }

  return open;
};
