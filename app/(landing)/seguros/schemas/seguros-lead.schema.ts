import { z } from "zod";

import { isValidSpanishLicensePlate } from "@/lib/validations/licensePlate";

import { spanishDniSchema } from "./spanish-dni.schema";

const requiredText = (message: string) =>
  z.string().trim().min(1, message);

const digitsOnly = (value: string): string => value.replace(/\D/g, "");

export const segurosLeadSchema = z.object({
  firstName: requiredText("El nombre es obligatorio"),
  lastName: requiredText("Los apellidos son obligatorios"),
  dni: spanishDniSchema,
  phone: requiredText("El teléfono es obligatorio").refine(
    (value) => {
      const digits = digitsOnly(value);
      return digits.length >= 9 && digits.length <= 15;
    },
    { message: "Introduce un teléfono válido" },
  ),
  email: z.email({
    error: "Introduce un correo electrónico válido",
  }),
  licensePlate: z
    .string()
    .trim()
    .refine(isValidSpanishLicensePlate, {
      message: "Introduce una matrícula válida",
    }),
  catalog_make_id: z
    .number({ error: "La marca es obligatoria" })
    .int()
    .positive("La marca es obligatoria"),
  catalog_model_id: z
    .number({ error: "El modelo es obligatorio" })
    .int()
    .positive("El modelo es obligatorio"),
  version_id: z.number().int().positive().optional(),
});

export type SegurosLeadFormValues = z.infer<typeof segurosLeadSchema>;

export const segurosLeadDefaultValues: Partial<SegurosLeadFormValues> = {
  firstName: "",
  lastName: "",
  dni: "",
  phone: "",
  email: "",
  licensePlate: "",
};
