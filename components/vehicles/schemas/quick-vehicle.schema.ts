import z from "zod";
import { VEHICLE_CONDITION_VALUES } from "../constants/vehicle-enums.constants";
import { phoneSchema } from "@/validations/resources/phone.schema";
import { vehicle_image_schema } from "./vehicle.schema";

export const quickVehicleSchema = z.object({
  images: z
    .array(vehicle_image_schema)
    .min(3, { error: "Añade al menos 3 fotos del vehículo." }),
  version_id: z.coerce
    .number({ error: "Selecciona una versión del catálogo." })
    .int()
    .positive(),
  catalog_make_id: z.coerce.number().int().positive().optional(),
  catalog_model_id: z.coerce.number().int().positive().optional(),
  catalog_year_id: z.coerce.number().int().positive().optional(),
  condition: z.enum(VEHICLE_CONDITION_VALUES),
  mileage: z.coerce.number().min(0, { error: "El kilometraje no puede ser negativo." }),
  price: z.coerce.number().min(0, { error: "El precio no puede ser negativo." }),
  lat: z.coerce.number({ error: "Selecciona una ubicación en el mapa." }),
  lng: z.coerce.number({ error: "Selecciona una ubicación en el mapa." }),
  phone: phoneSchema,
  email: z.email({ error: "Introduce un correo electrónico válido." }),
  description: z
    .string()
    .min(10, { error: "La descripción debe tener al menos 10 caracteres." }),
  transmission_type: z.enum(["manual", "automatic"], {
    error: "Selecciona un tipo de transmisión.",
  }),
  power: z.coerce.number().min(1, { error: "Introduce la potencia del vehículo." }),
  displacement: z.coerce.number().min(0, { error: "Introduce la cilindrada del vehículo." }),
  traction_id: z.uuid({ error: "Selecciona un tipo de tracción." }),
  features_ids: z.array(z.uuid()).optional().default([]),
  services_ids: z.array(z.uuid()).optional().default([]),
  publisher_type: z.enum(["professional", "particular"]).default("particular"),
});

export type QuickVehicleSchema = z.infer<typeof quickVehicleSchema>;

export const createQuickVehicleDefaultValues: QuickVehicleSchema = {
  images: [],
  version_id: 0,
  condition: "used",
  mileage: 0,
  price: 0,
  lat: 40.4168,
  lng: -3.7038,
  phone: { phone_code: "+34", phone: "" },
  email: "",
  description: "",
  transmission_type: "manual",
  power: 0,
  displacement: 0,
  traction_id: "",
  features_ids: [],
  services_ids: [],
  publisher_type: "particular",
};
