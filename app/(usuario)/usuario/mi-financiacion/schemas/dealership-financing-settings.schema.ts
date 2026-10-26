import { z } from "zod";

const percent = (label: string, max: number) =>
  z
    .number({ error: `Indica ${label}.` })
    .min(0, { error: `${label} no puede ser negativo.` })
    .max(max, { error: `${label} no puede superar el ${max} %.` });

const months = (label: string) =>
  z
    .number({ error: `Indica ${label}.` })
    .int({ error: `${label} debe ser un número entero de meses.` })
    .min(1, { error: `${label} debe ser de al menos 1 mes.` })
    .max(240, { error: `${label} no puede superar 240 meses.` });

const optionalAmount = (label: string, max: number) =>
  z
    .number({ error: `${label} no es válido.` })
    .min(0, { error: `${label} no puede ser negativo.` })
    .max(max, { error: `${label} es demasiado alto.` })
    .nullable();

export const dealershipFinancingSettingsFormSchema = z
  .object({
    enabled: z.boolean(),
    financial_entity: z
      .string()
      .max(120, { error: "La entidad financiera es demasiado larga." }),
    tin: percent("El TIN", 60),
    declared_tae: optionalAmount("La TAE", 100),
    min_term_months: months("El plazo mínimo"),
    max_term_months: months("El plazo máximo"),
    default_term_months: months("El plazo por defecto"),
    min_down_payment_percent: percent("La entrada mínima", 95),
    max_down_payment_percent: percent("La entrada máxima", 95),
    default_down_payment_percent: percent("La entrada por defecto", 95),
    min_financeable_amount: z
      .number({ error: "Indica el importe mínimo financiable." })
      .min(0, { error: "El importe mínimo no puede ser negativo." })
      .max(9_999_999, { error: "El importe mínimo es demasiado alto." }),
    opening_fee_percent: percent("La comisión de apertura", 20),
    opening_fee_fixed: optionalAmount("La comisión fija", 99_999),
    other_conditions: z
      .string()
      .max(1000, { error: "Máximo 1000 caracteres." }),
  })
  .superRefine((values, ctx) => {
    if (values.enabled && !values.financial_entity.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["financial_entity"],
        message: "Indica la entidad financiera para activar la financiación.",
      });
    }
    if (values.min_term_months > values.max_term_months) {
      ctx.addIssue({
        code: "custom",
        path: ["max_term_months"],
        message: "El plazo máximo no puede ser menor que el mínimo.",
      });
    }
    if (
      values.default_term_months < values.min_term_months ||
      values.default_term_months > values.max_term_months
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["default_term_months"],
        message: "El plazo por defecto debe estar entre el mínimo y el máximo.",
      });
    }
    if (values.min_down_payment_percent > values.max_down_payment_percent) {
      ctx.addIssue({
        code: "custom",
        path: ["max_down_payment_percent"],
        message: "La entrada máxima no puede ser menor que la mínima.",
      });
    }
    if (
      values.default_down_payment_percent < values.min_down_payment_percent ||
      values.default_down_payment_percent > values.max_down_payment_percent
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["default_down_payment_percent"],
        message: "La entrada por defecto debe estar entre la mínima y la máxima.",
      });
    }
  });

export type DealershipFinancingSettingsFormValues = z.infer<
  typeof dealershipFinancingSettingsFormSchema
>;
