import z from "zod";
import { VEHICLE_CONDITION_VALUES } from "../constants/vehicle-enums.constants";
import { phoneSchema } from "@/validations/resources/phone.schema";
import {
  vehicle_image_schema,
  vehicle_video_schema,
} from "./vehicle.schema";

const optionalUuid = z
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

const optionalUuidArray = z
  .array(z.uuid({ error: "Identificador no válido." }))
  .optional()
  .default([]);

const optionalNonNegativeNumber = z.coerce
  .number({ error: "Introduce un número válido." })
  .min(0, { error: "El valor no puede ser negativo." })
  .optional();

const optional_vehicle_videos_array = z
  .array(vehicle_video_schema)
  .optional()
  .default([]);

const quickVehicleBaseSchema = z.object({
  vehicle_type_id: z.uuid({ error: "Selecciona un tipo de vehículo." }),
  ref: z.string().optional(),
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
  videos: optional_vehicle_videos_array,
  version_id: z.coerce
    .number({ error: "Selecciona una versión del catálogo." })
    .int()
    .positive(),
  catalog_make_id: z.coerce.number().int().positive().optional(),
  catalog_model_id: z.coerce.number().int().positive().optional(),
  catalog_year_id: z.coerce.number().int().positive().optional(),
  catalog_body_type_id: z.coerce.number().int().positive().optional(),
  catalog_fuel_type_id: z.coerce.number().int().positive().optional(),
  /** Solo formulario: indica si el combustible admite recarga. No se envía al API. */
  catalog_fuel_can_charge: z.boolean().optional().default(false),
  condition: z.enum(VEHICLE_CONDITION_VALUES),
  mileage: z.coerce.number().min(0, { error: "El kilometraje no puede ser negativo." }),
  price: z.coerce.number().min(0, { error: "El precio no puede ser negativo." }),
  finance_price: optionalNonNegativeNumber,
  show_first_cuota: z.boolean().default(false),
  by_brand_warranty: z.boolean().default(false),
  show_exact_location: z.boolean().default(false),
  color_id: optionalUuid,
  category_id: optionalUuid,
  dgt_label_id: optionalUuid,
  lat: z.coerce.number({ error: "Selecciona una ubicación en el mapa." }),
  lng: z.coerce.number({ error: "Selecciona una ubicación en el mapa." }),
  phone: phoneSchema,
  show_phone: z.boolean().default(true),
  has_whatsapp: z.boolean().default(false),
  email: z.email({ error: "Introduce un correo electrónico válido." }),
  description: z
    .string()
    .optional(),
  transmission_type: z.enum(["manual", "automatic"], {
    error: "Selecciona un tipo de transmisión.",
  }),
  power: z.coerce.number().min(1, { error: "Introduce la potencia del vehículo." }),
  displacement: z.coerce.number().min(0, { error: "Introduce la cilindrada del vehículo." }),
  autonomy: optionalNonNegativeNumber,
  battery_capacity: optionalNonNegativeNumber,
  time_to_charge: optionalNonNegativeNumber,
  traction_id: z.uuid({ error: "Selecciona un tipo de tracción." }),
  features_ids: optionalUuidArray,
  services_ids: optionalUuidArray,
  cuota_ids: optionalUuidArray,
  warranty_type_id: optionalUuid,
  publisher_type: z.enum(["dealership", "particular"]).default("particular"),
  show_review_collab: z.boolean().default(true),
});

export const quickVehicleSchema = quickVehicleBaseSchema.superRefine((data, ctx) => {
  if (!data.catalog_fuel_can_charge) {
    return;
  }

  const electricFields = [
    { key: "autonomy" as const, label: "autonomía" },
    { key: "battery_capacity" as const, label: "capacidad de la batería" },
    { key: "time_to_charge" as const, label: "tiempo de carga" },
  ];

  for (const field of electricFields) {
    const value = data[field.key];
    if (value == null || value <= 0) {
      ctx.addIssue({
        code: "custom",
        message: `Introduce la ${field.label} del vehículo eléctrico.`,
        path: [field.key],
      });
    }
  }
});

export type QuickVehicleSchema = z.infer<typeof quickVehicleSchema>;

export const createQuickVehicleDefaultValues: QuickVehicleSchema = {
  vehicle_type_id: "",
  ref: "",
  license_plate: "",
  vin_code: "",
  images: [],
  videos: [],
  version_id: 0,
  catalog_fuel_can_charge: false,
  condition: "used",
  mileage: 0,
  price: 0,
  lat: 40.4168,
  lng: -3.7038,
  phone: { phone_code: "+34", phone: "" },
  show_phone: true,
  has_whatsapp: false,
  email: "",
  description: "",
  transmission_type: "manual",
  power: 0,
  displacement: 0,
  traction_id: "",
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
