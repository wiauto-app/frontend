import z from "zod";

import { MAX_NATIONAL_PHONE_DIGITS } from "@/lib/phone-limits";

export const phoneSchema = z.object({
  phone_code: z
    .string()
    .min(1, { error: "El prefijo telefónico es obligatorio." })
    .default("+34"),
  phone: z
    .string()
    .min(1, { error: "El teléfono es obligatorio." })
    .max(MAX_NATIONAL_PHONE_DIGITS, {
      error: `El teléfono no puede tener más de ${MAX_NATIONAL_PHONE_DIGITS} dígitos.`,
    })
    .regex(/^\d+$/, { error: "El teléfono solo puede contener dígitos." }),
});
