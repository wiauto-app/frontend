import z from "zod";
import {
  commonVehicleFormFields,
  requiredMakeName,
  requiredModelName,
  requiredTitle,
} from "./common-schema";

export const autocaravanaSchema = z.object({
  ...commonVehicleFormFields,
  title: requiredTitle,
  type_attributes: z
    .object({
      subtype: z
        .string({ error: "Indica el subtipo de autocaravana." })
        .trim()
        .min(1, { error: "Indica el subtipo de autocaravana." }),
      body_style: z.string().optional(),
      year: z.coerce.number().int().optional(),
      payload_kg: z.coerce.number().optional(),
      gvw_kg: z.coerce.number().optional(),
      seats: z.coerce.number().int().optional(),
      power: z.coerce.number().optional(),
      first_registration_date: z.string().optional(),
      registration_date: z.string().optional(),
    })
    .default({ subtype: "" }),
});

export const clasicoSchema = z.object({
  ...commonVehicleFormFields,
  title: requiredTitle,
  type_attributes: z
    .object({
      subtype: z
        .string({ error: "Indica el subtipo." })
        .trim()
        .min(1, { error: "Indica el subtipo." }),
      year: z.coerce
        .number({ error: "Introduce el año." })
        .int()
        .min(1900, { error: "Introduce un año válido." })
        .max(2100, { error: "Introduce un año válido." }),
      body_style: z.string().optional(),
      payload_kg: z.coerce.number().optional(),
      gvw_kg: z.coerce.number().optional(),
      seats: z.coerce.number().int().optional(),
      power: z.coerce.number().optional(),
      first_registration_date: z.string().optional(),
      registration_date: z.string().optional(),
    })
    .default({ subtype: "", year: new Date().getFullYear() }),
});

export const camionSchema = z.object({
  ...commonVehicleFormFields,
  make_name: requiredMakeName,
  model_name: requiredModelName,
  mileage: z.coerce
    .number()
    .min(0, { error: "El kilometraje no puede ser negativo." }),
  type_attributes: z
    .object({
      subtype: z
        .string({ error: "Indica el subtipo." })
        .trim()
        .min(1, { error: "Indica el subtipo." }),
      body_style: z
        .string({ error: "Indica la carrocería." })
        .trim()
        .min(1, { error: "Indica la carrocería." }),
      payload_kg: z.coerce
        .number({ error: "Introduce la carga útil." })
        .min(0, { error: "La carga útil no puede ser negativa." }),
      gvw_kg: z.coerce
        .number({ error: "Introduce el PMA." })
        .min(0, { error: "El PMA no puede ser negativo." }),
      year: z.coerce.number().int().optional(),
      seats: z.coerce.number().int().optional(),
      power: z.coerce.number().optional(),
      first_registration_date: z.string().optional(),
      registration_date: z.string().optional(),
    })
    .default({
      subtype: "",
      body_style: "",
      payload_kg: 0,
      gvw_kg: 0,
    }),
});

export const cocheSinCarnetSchema = z.object({
  ...commonVehicleFormFields,
  make_name: requiredMakeName,
  model_name: requiredModelName,
});

export const autobusSchema = z.object({
  ...commonVehicleFormFields,
  make_name: requiredMakeName,
  model_name: requiredModelName,
  mileage: z.coerce
    .number()
    .min(0, { error: "El kilometraje no puede ser negativo." }),
  type_attributes: z
    .object({
      power: z.coerce
        .number({ error: "Introduce la potencia." })
        .min(1, { error: "Introduce la potencia." }),
      seats: z.coerce
        .number({ error: "Introduce el número de plazas." })
        .int()
        .min(1, { error: "Introduce el número de plazas." }),
      first_registration_date: z
        .string({ error: "Indica la fecha de primera matriculación." })
        .trim()
        .min(1, { error: "Indica la fecha de primera matriculación." }),
      registration_date: z.string().optional(),
      subtype: z.string().optional(),
      body_style: z.string().optional(),
      year: z.coerce.number().int().optional(),
      payload_kg: z.coerce.number().optional(),
      gvw_kg: z.coerce.number().optional(),
    })
    .default({
      power: 0,
      seats: 0,
      first_registration_date: "",
    }),
});
