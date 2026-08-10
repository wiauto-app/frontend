import type { VehicleFormValues } from "./form-values";

/** Campos que se conservan al cambiar de tipo de vehículo. */
export const SHARED_VEHICLE_FORM_KEYS = [
  "vehicle_type_id",
  "images",
  "videos",
  "price",
  "lat",
  "lng",
  "phone",
  "show_phone",
  "has_whatsapp",
  "email",
  "description",
  "publisher_type",
  "license_plate",
  "vin_code",
] as const satisfies readonly (keyof VehicleFormValues)[];

export type SharedVehicleFormKey = (typeof SHARED_VEHICLE_FORM_KEYS)[number];

export const isSharedVehicleFormKey = (
  key: string,
): key is SharedVehicleFormKey =>
  (SHARED_VEHICLE_FORM_KEYS as readonly string[]).includes(key);
