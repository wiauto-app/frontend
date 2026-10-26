import { z } from "zod";

import type { VehicleFinancingOffer } from "@/interfaces/financing.interface";
import { acceptedTermsSchema } from "@/validations/acceptedTermsSchema";
import { phoneSchema } from "@/validations/phoneSchema";

type FinancingBounds = Pick<
  VehicleFinancingOffer,
  | "min_down_payment_percent"
  | "max_down_payment_percent"
  | "min_term_months"
  | "max_term_months"
>;

/** Calculadora: entrada y plazo dentro de los límites del concesionario. */
export const createFinancingCalculatorSchema = (bounds: FinancingBounds) =>
  z.object({
    down_payment_percent: z
      .number({ error: "Indica la entrada." })
      .min(bounds.min_down_payment_percent, {
        error: `La entrada mínima es del ${bounds.min_down_payment_percent} %.`,
      })
      .max(bounds.max_down_payment_percent, {
        error: `La entrada máxima es del ${bounds.max_down_payment_percent} %.`,
      }),
    term_months: z
      .number({ error: "Indica el plazo." })
      .int({ error: "El plazo debe ser un número entero de meses." })
      .min(bounds.min_term_months, {
        error: `El plazo mínimo es de ${bounds.min_term_months} meses.`,
      })
      .max(bounds.max_term_months, {
        error: `El plazo máximo es de ${bounds.max_term_months} meses.`,
      }),
  });

export type FinancingCalculatorValues = z.infer<
  ReturnType<typeof createFinancingCalculatorSchema>
>;

/** Solicitud de financiación (comprador). */
export const financingRequestFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("El correo electrónico no es válido"),
  phone: phoneSchema,
  message: z.string().max(1000, "Máximo 1000 caracteres."),
  accepted_terms: acceptedTermsSchema,
});

export type FinancingRequestFormValues = z.infer<
  typeof financingRequestFormSchema
>;
