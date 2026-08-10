export const VEHICLE_FORM_SLUGS = [
  "coche",
  "furgoneta",
  "autocaravana",
  "clasico-o-competicion",
  "camion",
  "coche-sin-carnet",
  "autobus",
] as const;

export type VehicleFormSlug = (typeof VEHICLE_FORM_SLUGS)[number];

export const isVehicleFormSlug = (value: string): value is VehicleFormSlug =>
  (VEHICLE_FORM_SLUGS as readonly string[]).includes(value);

export const DEFAULT_VEHICLE_FORM_SLUG: VehicleFormSlug = "coche";
