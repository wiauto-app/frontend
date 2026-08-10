import z from "zod";
import { phoneSchema } from "@/validations/resources/phone.schema";
import { VEHICLE_CONDITION_VALUES } from "../../constants/vehicle-enums.constants";
import {
  vehicle_image_schema,
  vehicle_video_schema,
} from "../../schemas/vehicle.schema";

export const optionalUuid = z
  .union([
    z.uuid({ error: "Identificador no válido." }),
    z.literal(""),
    z.null(),
  ])
  .optional()
  .transform((value) => {
    if (value === "" || value === undefined) return undefined;
    if (value === null) return null;
    return value;
  });

export const optionalUuidArray = z
  .array(z.uuid({ error: "Identificador no válido." }))
  .optional()
  .default([]);

export const optionalNonNegativeNumber = z.coerce
  .number({ error: "Introduce un número válido." })
  .min(0, { error: "El valor no puede ser negativo." })
  .optional();

export const optionalVehicleVideosArray = z
  .array(vehicle_video_schema)
  .optional()
  .default([]);

export const typeAttributesSchema = z
  .object({
    subtype: z.string().optional(),
    body_style: z.string().optional(),
    year: z.coerce.number().int().min(1900).max(2100).optional(),
    payload_kg: z.coerce.number().min(0).optional(),
    gvw_kg: z.coerce.number().min(0).optional(),
    seats: z.coerce.number().int().min(1).optional(),
    power: z.coerce.number().min(0).optional(),
    first_registration_date: z.string().optional(),
    registration_date: z.string().optional(),
  })
  .optional()
  .default({});

/** Campos comunes a todos los perfiles de publicación. */
export const commonVehicleFormFields = {
  vehicle_type_id: z.uuid({ error: "Selecciona un tipo de vehículo." }),
  license_plate: z
    .union([
      z.literal(""),
      z
        .string()
        .min(5, { error: "La matrícula debe tener al menos 5 caracteres." }),
    ])
    .optional(),
  vin_code: z
    .union([
      z.literal(""),
      z.string().min(1, { error: "El VIN debe tener al menos 1 carácter." }),
    ])
    .optional(),
  images: z
    .array(vehicle_image_schema)
    .min(3, { error: "Añade al menos 3 fotos del vehículo." }),
  videos: optionalVehicleVideosArray,
  price: z.coerce.number().min(0, { error: "El precio no puede ser negativo." }),
  lat: z.coerce.number({ error: "Selecciona una ubicación en el mapa." }),
  lng: z.coerce.number({ error: "Selecciona una ubicación en el mapa." }),
  phone: phoneSchema,
  show_phone: z.boolean().default(true),
  has_whatsapp: z.boolean().default(false),
  email: z.email({ error: "Introduce un correo electrónico válido." }),
  description: z.string().optional(),
  color_id: optionalUuid,
  category_id: optionalUuid,
  dgt_label_id: optionalUuid,
  features_ids: optionalUuidArray,
  services_ids: optionalUuidArray,
  cuota_ids: optionalUuidArray,
  warranty_type_id: optionalUuid,
  publisher_type: z.enum(["dealership", "particular"]).default("particular"),
  title: z.string().optional(),
  make_name: z.string().optional(),
  model_name: z.string().optional(),
  type_attributes: typeAttributesSchema,
  condition: z.enum(VEHICLE_CONDITION_VALUES).default("used"),
  mileage: z.coerce
    .number()
    .min(0, { error: "El kilometraje no puede ser negativo." })
    .default(0),
  transmission_type: z.enum(["manual", "automatic"]).optional(),
  power: optionalNonNegativeNumber,
  displacement: optionalNonNegativeNumber,
  autonomy: optionalNonNegativeNumber,
  battery_capacity: optionalNonNegativeNumber,
  time_to_charge: optionalNonNegativeNumber,
  traction_id: optionalUuid,
  version_id: z.coerce.number().int().optional(),
  catalog_make_id: z.coerce.number().int().positive().optional(),
  catalog_model_id: z.coerce.number().int().positive().optional(),
  catalog_year_id: z.coerce.number().int().positive().optional(),
  catalog_fuel_type_id: z.coerce.number().int().positive().optional(),
  catalog_fuel_can_charge: z.boolean().optional().default(false),
};

export const requiredTitle = z
  .string({ error: "Introduce un título para el anuncio." })
  .trim()
  .min(3, { error: "El título debe tener al menos 3 caracteres." });

export const requiredMakeName = z
  .string({ error: "Introduce la marca." })
  .trim()
  .min(1, { error: "Introduce la marca." });

export const requiredModelName = z
  .string({ error: "Introduce el modelo." })
  .trim()
  .min(1, { error: "Introduce el modelo." });
