import { z } from "zod";

import type { StrapiTasadorFormulario } from "@/interfaces/strapi-components.interface";
import { DEFAULT_PHONE_CODE } from "@/components/forms/phoneInput";
import { createPhoneSchema } from "@/validations/phoneSchema";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

const requiredId = (message: string) =>
  z.coerce.number({ error: message }).int().positive({ error: message });

/** Los mensajes salen de `tasador.formulario`; si faltan, se usan los de siempre. */
export const createTasadorSchema = (content?: StrapiTasadorFormulario | null) =>
  z.object({
    catalog_make_id: requiredId(content?.marca?.mensaje_requerido || "Selecciona la marca"),
    catalog_model_id: requiredId(content?.modelo?.mensaje_requerido || "Selecciona el modelo"),
    catalog_year_id: requiredId(content?.anio?.mensaje_requerido || "Selecciona el año"),
    version_id: requiredId(content?.version?.mensaje_requerido || "Selecciona la versión"),
    fuel_type_id: z.number().int().positive().optional(),
    transmission_type: z.enum(["manual", "automatic"], {
      error: content?.transmision?.mensaje_requerido || "Selecciona la transmisión",
    }),
    mileage: z.coerce
      .number({ error: content?.kilometraje?.mensaje_requerido || "Introduce el kilometraje" })
      .int({ error: content?.kilometraje?.mensaje_invalido || "Introduce un kilometraje válido" })
      .min(0, { error: content?.kilometraje?.mensaje_invalido || "Introduce un kilometraje válido" })
      .max(2_000_000, {
        error: content?.kilometraje?.mensaje_invalido || "Introduce un kilometraje válido",
      }),
    power: z.preprocess(
      emptyToUndefined,
      z.coerce
        .number()
        .int()
        .min(1, { error: content?.potencia?.mensaje_invalido || "Introduce una potencia válida" })
        .max(2000, { error: content?.potencia?.mensaje_invalido || "Introduce una potencia válida" })
        .optional(),
    ),
    plate: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .trim()
        .max(16, { error: content?.matricula?.mensaje_invalido || "Introduce una matrícula válida" })
        .regex(/^[A-Za-z0-9 -]*$/, {
          error: content?.matricula?.mensaje_invalido || "Introduce una matrícula válida",
        })
        .optional(),
    ),
    name: z
      .string()
      .trim()
      .min(2, {
        error: content?.nombre?.mensaje_invalido || "El nombre debe tener al menos 2 caracteres",
      }),
    last_name: z.string().trim().optional(),
    email: z.email(content?.email?.mensaje_invalido || "Email inválido"),
    phone: createPhoneSchema(content?.telefono),
  });

export type TasadorFormValues = z.infer<ReturnType<typeof createTasadorSchema>>;
export type TasadorFormInput = z.input<ReturnType<typeof createTasadorSchema>>;

export const TASADOR_DEFAULT_VALUES: TasadorFormInput = {
  catalog_make_id: 0,
  catalog_model_id: 0,
  catalog_year_id: 0,
  version_id: 0,
  fuel_type_id: undefined,
  transmission_type: "manual",
  mileage: "",
  power: "",
  plate: "",
  name: "",
  last_name: "",
  email: "",
  phone: { phone_code: DEFAULT_PHONE_CODE, phone: "" },
};
