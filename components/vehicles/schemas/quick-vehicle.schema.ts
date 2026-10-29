import "@/lib/zod-es";
import z from "zod";
import { VEHICLE_CONDITION_VALUES } from "../constants/vehicle-enums.constants";
import { phoneSchema } from "@/validations/resources/phone.schema";
import {
  vehicle_image_schema,
  vehicle_video_schema,
} from "./vehicle.schema";

export const QUICK_VEHICLE_LOCATION_REQUIRED_MESSAGE =
  "Indica dónde está el vehículo: código postal, ciudad o «Mi ubicación».";

/** Por debajo de este número se sugiere subir más fotos (no bloquea). */
export const RECOMMENDED_VEHICLE_IMAGES = 6;

const optionalUuid = z
  .union([
    z.uuid({ error: "Identificador no válido." }),
    z.literal(""),
    z.null(),
  ])
  .optional()
  .transform((value) => {
    if (value === "" || value === undefined || value === null) {
      return undefined;
    }
    return value;
  });

const optionalUuidArray = z
  .array(z.uuid({ error: "Identificador no válido." }))
  .optional()
  .default([]);

/** Los inputs numéricos vacíos llegan como `""`: sin esto, `coerce` los convierte en 0. */
const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

const emptyOrZeroToUndefined = (value: unknown) =>
  value === "" || value === null || Number(value) === 0 ? undefined : value;

const MIN_VEHICLE_IMAGES = 1;

const optionalBoundedNumber = (max: number, maxMessage: string) =>
  z.coerce
    .number({ error: "Introduce un número válido." })
    .min(0, { error: "El valor no puede ser negativo." })
    .max(max, { error: maxMessage })
    .optional();

const optional_vehicle_videos_array = z
  .array(vehicle_video_schema)
  .optional()
  .default([]);

const optionalCatalogId = (message: string) =>
  z.coerce
    .number({ error: message })
    .int({ error: message })
    .positive({ error: message })
    .optional();

const quickVehicleBaseSchema = z.object({
  vehicle_type_id: z.uuid({ error: "Selecciona un tipo de vehículo." }),
  ref: z
    .string()
    .max(50, { error: "La referencia no puede tener más de 50 caracteres." })
    .optional(),
  license_plate: z
    .string()
    .optional()
    .transform((value) => {
      if (!value?.trim()) return "";
      return value.trim().toUpperCase().replace(/\s+/g, "");
    })
    .refine(
      (value) => value === "" || /^\d{4}[A-Z]{3}$/.test(value),
      { error: "La matrícula debe tener el formato 1234ABC." },
    ),
  vin_code: z
    .string()
    .optional()
    .transform((value) => {
      if (!value?.trim()) return "";
      return value.trim().toUpperCase();
    })
    .refine(
      (value) => value === "" || /^[A-HJ-NPR-Z0-9]{17}$/.test(value),
      { error: "El VIN debe tener exactamente 17 caracteres válidos." },
    ),
  images: z
    .array(vehicle_image_schema)
    .min(MIN_VEHICLE_IMAGES, {
      error: "Sube al menos una fotografía del vehículo.",
    }),
  videos: optional_vehicle_videos_array,
  version_id: z.coerce
    .number({ error: "Selecciona una versión del catálogo." })
    .int({ error: "Selecciona una versión del catálogo." })
    .positive({ error: "Selecciona una versión del catálogo." }),
  catalog_make_id: optionalCatalogId("Selecciona la marca."),
  catalog_model_id: optionalCatalogId("Selecciona el modelo."),
  catalog_year_id: optionalCatalogId("Selecciona el año."),
  catalog_body_type_id: optionalCatalogId("Selecciona la carrocería."),
  catalog_fuel_type_id: optionalCatalogId("Selecciona el combustible."),
  /** Solo formulario: indica si el combustible admite recarga. No se envía al API. */
  catalog_fuel_can_charge: z.boolean().optional().default(false),
  condition: z.enum(VEHICLE_CONDITION_VALUES, {
    error: "Selecciona si el vehículo es nuevo o usado.",
  }),
  mileage: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ error: "Introduce el kilometraje." })
      .min(0, { error: "El kilometraje no puede ser negativo." })
      .max(9_999_999, {
        error: "El kilometraje no puede ser mayor a 9.999.999 km.",
      }),
  ),
  price: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ error: "Introduce el precio." })
      .min(1, { error: "El precio debe ser mayor que 0 €." })
      .max(9_999_999, {
        error: "El precio no puede ser mayor a 9.999.999 €.",
      }),
  ),
  finance_price: optionalBoundedNumber(9999999, "El precio financiado no puede ser mayor a 9999999."),
  offer_financing: z.boolean().default(false),
  show_first_cuota: z.boolean().default(false),
  by_brand_warranty: z.boolean().default(false),
  show_exact_location: z.boolean().default(false),
  color_id: optionalUuid,
  category_id: optionalUuid,
  dgt_label_id: optionalUuid,
  lat: z.preprocess(
    emptyToUndefined,
    z.coerce.number({ error: QUICK_VEHICLE_LOCATION_REQUIRED_MESSAGE }),
  ),
  lng: z.preprocess(
    emptyToUndefined,
    z.coerce.number({ error: QUICK_VEHICLE_LOCATION_REQUIRED_MESSAGE }),
  ),
  phone: phoneSchema,
  show_phone: z.boolean().default(true),
  has_whatsapp: z.boolean().default(false),
  email: z.email({ error: "Introduce un correo electrónico válido." }),
  description: z
    .string()
    .max(3000, { error: "La descripción no puede tener más de 3000 caracteres." })
    .optional(),
  transmission_type: z.enum(["manual", "automatic"], {
    error: "Selecciona un tipo de transmisión.",
  }),
  power: z.preprocess(
    emptyOrZeroToUndefined,
    z.coerce
      .number({ error: "Introduce la potencia en CV." })
      .min(1, { error: "La potencia debe ser de al menos 1 CV." })
      .max(9999, { error: "La potencia no puede ser mayor a 9999 CV." })
      .optional(),
  ),
  displacement: z.preprocess(
    (value) => emptyToUndefined(value) ?? 0,
    z.coerce
      .number({ error: "Introduce la cilindrada en cc." })
      .min(0, { error: "La cilindrada no puede ser negativa." })
      .max(20_000, { error: "La cilindrada no puede ser mayor a 20000 cc." }),
  ),
  autonomy: optionalBoundedNumber(2000, "La autonomía no puede ser mayor a 2000 km."),
  battery_capacity: optionalBoundedNumber(500, "La capacidad de la batería no puede ser mayor a 500 kWh."),
  time_to_charge: optionalBoundedNumber(100, "El tiempo de carga no puede ser mayor a 100 h."),
  traction_id: optionalUuid,
  features_ids: optionalUuidArray,
  services_ids: optionalUuidArray,
  cuota_ids: optionalUuidArray,
  warranty_type_id: optionalUuid,
  publisher_type: z
    .enum(["dealership", "particular"], {
      error: "Selecciona el tipo de publicador.",
    })
    .default("particular"),
  show_review_collab: z.boolean().default(true),
});

/** La ficha técnica (incluidos los datos eléctricos) se autocompleta y es opcional. */
export const quickVehicleSchema = quickVehicleBaseSchema;

export type QuickVehicleSchema = z.infer<typeof quickVehicleSchema>;

/** Km, precio y ubicación arrancan vacíos: el usuario debe rellenarlos. */
export interface QuickVehicleDefaultValues
  extends Omit<QuickVehicleSchema, "mileage" | "price" | "lat" | "lng"> {
  mileage?: number;
  price?: number;
  lat?: number;
  lng?: number;
}

export const createQuickVehicleDefaultValues: QuickVehicleDefaultValues = {
  vehicle_type_id: "",
  ref: "",
  license_plate: "",
  vin_code: "",
  images: [],
  videos: [],
  version_id: 0,
  catalog_fuel_can_charge: false,
  condition: "used",
  mileage: undefined,
  price: undefined,
  lat: undefined,
  lng: undefined,
  phone: { phone_code: "+34", phone: "" },
  show_phone: true,
  has_whatsapp: false,
  email: "",
  description: "",
  transmission_type: "manual",
  power: undefined,
  displacement: 0,
  traction_id: "",
  offer_financing: false,
  show_first_cuota: false,
  by_brand_warranty: false,
  show_exact_location: false,
  features_ids: [],
  services_ids: [],
  cuota_ids: [],
  color_id: undefined,
  category_id: undefined,
  dgt_label_id: undefined,
  warranty_type_id: undefined,
  publisher_type: "particular",
  show_review_collab: true,
};
