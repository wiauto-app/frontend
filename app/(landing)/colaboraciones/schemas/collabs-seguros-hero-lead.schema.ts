import { z } from "zod";

import { isValidSpanishLicensePlate } from "@/lib/validations/licensePlate";

const requiredText = (message: string) => z.string().trim().min(1, message);

const digitsOnly = (value: string): string => value.replace(/\D/g, "");

export const collabsSegurosHeroLeadSchema = z.object({
  fullName: requiredText("El nombre y los apellidos son obligatorios"),
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
  vehicle_type_id: requiredText("El tipo de vehículo es obligatorio"),
  licensePlate: z
    .string()
    .trim()
    .refine(isValidSpanishLicensePlate, {
      message: "Introduce una matrícula válida",
    }),
  observations: z.string().trim().max(1000, "Máximo 1000 caracteres"),
});

export type CollabsSegurosHeroLeadFormValues = z.infer<
  typeof collabsSegurosHeroLeadSchema
>;

export const collabsSegurosHeroLeadDefaultValues: CollabsSegurosHeroLeadFormValues =
  {
    fullName: "",
    phone: "",
    email: "",
    vehicle_type_id: "",
    licensePlate: "",
    observations: "",
  };
