import type { LucideIcon } from "lucide-react";
import { BadgePercent, Car, CarFront } from "lucide-react";

import type { FieldErrors } from "react-hook-form";

import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";

export interface QuickVehicleIntroStep {
  id: number;
  name: string;
  icon: LucideIcon;
  fields: (keyof QuickVehicleSchema)[];
}

export const QUICK_VEHICLE_STEP_QUERY_PARAM = "step";

/** Marca el único botón que puede publicar (evita submit por Enter en inputs). */
export const QUICK_VEHICLE_SUBMIT_ATTR = "data-quick-vehicle-submit";

export const QUICK_VEHICLE_INTRO_STEPS: QuickVehicleIntroStep[] = [
  {
    id: 1,
    name: "Tipo",
    icon: CarFront,
    fields: ["vehicle_type_id"],
  },
  {
    id: 2,
    name: "Datos del vehículo",
    icon: Car,
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
    icon: BadgePercent,
    fields: [
      "offer_financing",
      "finance_price",
      "show_first_cuota",
      "by_brand_warranty",
      "cuota_ids",
      "warranty_type_id",
    ],
  },
];

export const QUICK_VEHICLE_FIELD_LABELS: Partial<
  Record<keyof QuickVehicleSchema, string>
> = {
  vehicle_type_id: "Tipo de vehículo",
  license_plate: "Matrícula",
  vin_code: "VIN",
  ref: "Referencia",
  images: "Fotos",
  videos: "Vídeos",
  version_id: "Versión",
  catalog_make_id: "Marca",
  catalog_model_id: "Modelo",
  catalog_year_id: "Año",
  catalog_body_type_id: "Carrocería",
  catalog_fuel_type_id: "Combustible",
  condition: "Estado",
  mileage: "Kilometraje",
  price: "Precio",
  lat: "Ubicación",
  lng: "Ubicación",
  phone: "Teléfono",
  email: "Correo electrónico",
  transmission_type: "Transmisión",
  power: "Potencia",
  displacement: "Cilindrada",
  traction_id: "Tracción",
  autonomy: "Autonomía",
  battery_capacity: "Capacidad de la batería",
  time_to_charge: "Tiempo de carga",
  finance_price: "Precio financiado",
  cuota_ids: "Cuotas",
  warranty_type_id: "Garantía",
};

export const getQuickVehicleFieldErrorMessage = (
  errors: FieldErrors<QuickVehicleSchema>,
  field: keyof QuickVehicleSchema,
): string | undefined => {
  const error = errors[field];
  if (!error) {
    return undefined;
  }

  if (typeof error.message === "string" && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    for (const nested of Object.values(error)) {
      if (
        nested &&
        typeof nested === "object" &&
        "message" in nested &&
        typeof nested.message === "string" &&
        nested.message
      ) {
        return nested.message;
      }
    }
  }

  return undefined;
};

export interface QuickVehicleFieldErrorMatch {
  step: QuickVehicleIntroStep;
  field: keyof QuickVehicleSchema;
  message: string;
}

export const findFirstQuickVehicleErrorField = (
  errors: FieldErrors<QuickVehicleSchema>,
  steps: QuickVehicleIntroStep[] = QUICK_VEHICLE_INTRO_STEPS,
): QuickVehicleFieldErrorMatch | null => {
  for (const step of steps) {
    for (const field of step.fields) {
      const message = getQuickVehicleFieldErrorMessage(errors, field);
      if (message) {
        return { step, field, message };
      }
    }
  }

  return null;
};

export const findQuickVehicleErrorStep = (
  errors: FieldErrors<QuickVehicleSchema>,
  steps: QuickVehicleIntroStep[] = QUICK_VEHICLE_INTRO_STEPS,
): QuickVehicleIntroStep | null =>
  findFirstQuickVehicleErrorField(errors, steps)?.step ?? null;

export const getQuickPublishStepMotivation = (
  stepIndex: number,
  totalSteps: number,
): string => {
  if (totalSteps <= 1 || stepIndex <= 0) {
    return "Empieza eligiendo el tipo de vehículo";
  }

  if (stepIndex >= totalSteps - 1) {
    return "Último paso: ya casi está publicado";
  }

  return "Tu anuncio está casi listo";
};

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
