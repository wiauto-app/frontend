import z from "zod";

import { phoneSchema } from "@/validations/resources/phone.schema";

export const tasadorSchema = z.object({
  catalog_make_id: z.coerce
    .number({ error: "Selecciona una marca." })
    .int()
    .positive(),
  catalog_model_id: z.coerce
    .number({ error: "Selecciona un modelo." })
    .int()
    .positive(),
  catalog_year_id: z.coerce
    .number({ error: "Selecciona un año." })
    .int()
    .positive(),
  version_id: z.coerce
    .number({ error: "Selecciona una versión del catálogo." })
    .int()
    .positive(),
  fuel_type_id: z.coerce.number().int().positive().optional(),
  body_type_id: z.coerce.number().int().positive().optional(),
  transmission_type: z.enum(["manual", "automatic"], {
    error: "Selecciona un tipo de transmisión.",
  }),
  mileage: z.coerce
    .number({ error: "Introduce el kilometraje." })
    .min(0, { error: "El kilometraje no puede ser negativo." }),
  lat: z.coerce.number({ error: "Selecciona una ubicación en el mapa." }),
  lng: z.coerce.number({ error: "Selecciona una ubicación en el mapa." }),
  name: z.string().min(1, { error: "El nombre es obligatorio." }),
  email: z.email({ error: "Introduce un correo electrónico válido." }),
  phone: phoneSchema,
});

export type TasadorSchema = z.infer<typeof tasadorSchema>;

export const tasadorDefaultValues: TasadorSchema = {
  catalog_make_id: 0,
  catalog_model_id: 0,
  catalog_year_id: 0,
  version_id: 0,
  fuel_type_id: undefined,
  body_type_id: undefined,
  transmission_type: "manual",
  mileage: 0,
  lat: 40.4168,
  lng: -3.7038,
  name: "",
  email: "",
  phone: { phone_code: "+34", phone: "" },
};
