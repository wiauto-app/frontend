import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";

export interface QuickVehicleIntroStep {
  id: number;
  name: string;
  fields: (keyof QuickVehicleSchema)[];
}

export const QUICK_VEHICLE_STEP_QUERY_PARAM = "step";

/** Marca el único botón que puede publicar (evita submit por Enter en inputs). */
export const QUICK_VEHICLE_SUBMIT_ATTR = "data-quick-vehicle-submit";

export const QUICK_VEHICLE_INTRO_STEPS: QuickVehicleIntroStep[] = [
  {
    id: 1,
    name: "Tipo",
    fields: ["vehicle_type_id"],
  },
  {
    id: 2,
    name: "Datos del vehículo",
    fields: [
      "license_plate",
      "vin_code",
      "ref",
      "images",
      "videos",
      "version_id",
      "catalog_make_id",
      "catalog_model_id",
      "catalog_year_id",
      "catalog_body_type_id",
      "catalog_fuel_type_id",
      "catalog_fuel_can_charge",
      "condition",
      "mileage",
      "price",
      "show_exact_location",
      "color_id",
      "category_id",
      "dgt_label_id",
      "lat",
      "lng",
      "phone",
      "show_phone",
      "has_whatsapp",
      "email",
      "description",
      "transmission_type",
      "power",
      "displacement",
      "autonomy",
      "battery_capacity",
      "time_to_charge",
      "traction_id",
      "features_ids",
      "services_ids",
      "publisher_type",
    ],
  },
  {
    id: 3,
    name: "Financiación y garantía",
    fields: [
      "finance_price",
      "show_first_cuota",
      "by_brand_warranty",
      "cuota_ids",
      "warranty_type_id",
    ],
  },
];

export const findQuickVehicleErrorStep = (
  errors: Partial<Record<keyof QuickVehicleSchema, unknown>>,
  steps: QuickVehicleIntroStep[] = QUICK_VEHICLE_INTRO_STEPS,
): QuickVehicleIntroStep | null =>
  steps.find(step => step.fields.some(field => Boolean(errors[field]))) ?? null;

export const parseQuickVehicleStep = (value: string | null): number | null => {
  if (value == null) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    return null;
  }

  if (parsed < 1 || parsed > QUICK_VEHICLE_INTRO_STEPS.length) {
    return null;
  }

  return parsed;
};
