import { z } from "zod";

const requiredText = (message: string) => z.string().trim().min(1, message);

/** Matrícula española actual (1234ABC) o antigua (A1234BC), con espacios opcionales. */
const isValidSpanishLicensePlate = (raw: string): boolean => {
  const value = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!value) {
    return true;
  }

  return (
    /^\d{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/.test(value) ||
    /^[A-Z]{1,2}\d{4}[A-Z]{1,2}$/.test(value)
  );
};

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
