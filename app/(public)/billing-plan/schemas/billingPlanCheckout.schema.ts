import { z } from "zod";

import { acceptedTermsSchema } from "@/validations/acceptedTermsSchema";
import { phoneSchema } from "@/validations/phoneSchema";

export const billingAccountTypeSchema = z.enum(["self_employed", "company"]);

export const billingPlanCheckoutSchema = z.object({
  account_type: billingAccountTypeSchema,
  legal_name: z
    .string()
    .trim()
    .min(2, "Introduce el nombre o la razón social"),
  tax_id: z
    .string()
    .trim()
    .min(8, "Introduce un NIF, NIE o CIF válido")
    .max(20, "El NIF/NIE/CIF es demasiado largo"),
  commercial_name: z.string().trim().optional(),
  email: z.string().trim().email("Introduce un correo válido"),
  phone: phoneSchema,
  accepted_terms: acceptedTermsSchema,
});

export type BillingPlanCheckoutFormValues = z.infer<
  typeof billingPlanCheckoutSchema
>;
