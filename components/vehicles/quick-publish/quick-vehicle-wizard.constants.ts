import type { LucideIcon } from "lucide-react";
import { BadgePercent, Car, ImageIcon, ListChecks } from "lucide-react";

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

/** Ids estables (van en `?step`); el orden del array define el recorrido. */
export const QUICK_VEHICLE_STEP_IDS = {
  photos: 1,
  /** Datos del anuncio (antes «Coche» + «Contacto»). */
  data: 2,
  financing: 3,
  /** Legacy: redirige a `data`. */
  contact: 4,
  /** Información extra (profesionales). */
  extra: 5,
} as const;

const TECHNICAL_SHEET_FIELDS: (keyof QuickVehicleSchema)[] = [
  "transmission_type",
  "power",
  "displacement",
  "autonomy",
  "battery_capacity",
  "time_to_charge",
  "traction_id",
];

const PHOTOS_STEP: QuickVehicleIntroStep = {
  id: QUICK_VEHICLE_STEP_IDS.photos,
  name: "Fotos",
  icon: ImageIcon,
  fields: ["images", "videos"],
};

const DATA_STEP_FIELDS: (keyof QuickVehicleSchema)[] = [
  "images",
  "videos",
  "vehicle_type_id",
  "license_plate",
  "ref",
  "version_id",
  "catalog_make_id",
  "catalog_model_id",
  "catalog_year_id",
  "condition",
  "mileage",
  "price",
  "publisher_type",
  "lat",
  "lng",
  "show_exact_location",
  "phone",
  "show_phone",
  "has_whatsapp",
  "email",
  "show_review_collab",
];

const EXTRA_STEP_FIELDS: (keyof QuickVehicleSchema)[] = [
  "catalog_body_type_id",
  "catalog_fuel_type_id",
  "catalog_fuel_can_charge",
  "color_id",
  "category_id",
  "dgt_label_id",
  ...TECHNICAL_SHEET_FIELDS,
  "features_ids",
  "services_ids",
];

const FINANCING_STEP: QuickVehicleIntroStep = {
  id: QUICK_VEHICLE_STEP_IDS.financing,
  name: "Garantía y financiación",
  icon: BadgePercent,
  fields: [
    "offer_financing",
    "finance_price",
    "show_first_cuota",
    "by_brand_warranty",
    "cuota_ids",
    "warranty_type_id",
    /** Al final del recorrido, con el máximo contexto para la IA. */
    "description",
  ],
};

/** Asegura que `description` solo valide en el último paso disponible. */
export const withDescriptionOnLastStep = (
  steps: QuickVehicleIntroStep[],
): QuickVehicleIntroStep[] => {
  if (steps.length === 0) {
    return steps;
  }

  return steps.map((step, index) => {
    const fieldsWithoutDescription = step.fields.filter(
      (field) => field !== "description",
    );
    const isLast = index === steps.length - 1;

    if (!isLast) {
      return { ...step, fields: fieldsWithoutDescription };
    }

    return {
      ...step,
      fields: [...fieldsWithoutDescription, "description"],
    };
  });
};

const DATA_STEP: QuickVehicleIntroStep = {
  id: QUICK_VEHICLE_STEP_IDS.data,
  name: "Datos del anuncio",
  icon: Car,
  fields: DATA_STEP_FIELDS,
};

const EXTRA_STEP: QuickVehicleIntroStep = {
  id: QUICK_VEHICLE_STEP_IDS.extra,
  name: "Información extra",
  icon: ListChecks,
  fields: EXTRA_STEP_FIELDS,
};

/** Web: fotos van dentro de «Datos». Profesional: + extra + financiación. */
export const QUICK_VEHICLE_WIZARD_STEPS: QuickVehicleIntroStep[] = [
  DATA_STEP,
  EXTRA_STEP,
  FINANCING_STEP,
];

/** Paso de medios legacy (solo normalización de URL `?step=1`). */
export const QUICK_VEHICLE_PHOTOS_STEP = PHOTOS_STEP;

export const QUICK_VEHICLE_INTRO_STEPS = QUICK_VEHICLE_WIZARD_STEPS;

export const QUICK_VEHICLE_EDIT_STEPS = QUICK_VEHICLE_WIZARD_STEPS;

export const isSubscriberOnlyQuickVehicleStep = (stepId: number): boolean =>
  stepId === QUICK_VEHICLE_STEP_IDS.financing ||
  stepId === QUICK_VEHICLE_STEP_IDS.extra;

/** Pasos antiguos en URL → paso actual. */
export const normalizeQuickVehicleStepId = (stepId: number): number => {
  if (stepId === QUICK_VEHICLE_STEP_IDS.contact) {
    return QUICK_VEHICLE_STEP_IDS.data;
  }
  if (stepId === QUICK_VEHICLE_STEP_IDS.photos) {
    return QUICK_VEHICLE_STEP_IDS.data;
  }
  return stepId;
};

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
  color_id: "Color",
  category_id: "Categoría",
  dgt_label_id: "Etiqueta DGT",
  description: "Descripción",
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
  if (totalSteps <= 1) {
    return "Fotos, datos y contacto en un solo paso";
  }

  if (stepIndex <= 0) {
    return "Fotos, datos del vehículo y contacto";
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

  const normalized = normalizeQuickVehicleStepId(parsed);

  const isKnownStep = Object.values(QUICK_VEHICLE_STEP_IDS).some(
    (stepId) => stepId === normalized,
  );

  return isKnownStep ? normalized : null;
};
