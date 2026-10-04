import { z } from "zod";

import type { StrapiCampoTelefonoMensajes } from "@/interfaces/strapi-content-props.interface";
import { MAX_NATIONAL_PHONE_DIGITS } from "@/lib/phone-limits";

/** Schema de teléfono con mensajes opcionales de `formulario.campo-telefono`. */
export const createPhoneSchema = (
  mensajes?: Partial<StrapiCampoTelefonoMensajes> | null,
) =>
  z.object({
    phone_code: z
      .string()
      .min(
        1,
        mensajes?.mensaje_prefijo_requerido ||
          "El código de teléfono es requerido",
      ),
    phone: z
      .string()
      .min(1, mensajes?.mensaje_requerido || "El teléfono es requerido")
      .max(
        MAX_NATIONAL_PHONE_DIGITS,
        mensajes?.mensaje_longitud ||
          `El teléfono no puede tener más de ${MAX_NATIONAL_PHONE_DIGITS} dígitos`,
      )
      .regex(
        /^\d+$/,
        mensajes?.mensaje_invalido || "El teléfono solo puede contener dígitos",
      ),
  });

export const phoneSchema = createPhoneSchema();
