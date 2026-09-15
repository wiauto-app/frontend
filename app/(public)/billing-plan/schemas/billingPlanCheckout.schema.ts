import { z } from "zod";

import { acceptedTermsSchema } from "@/validations/acceptedTermsSchema";
import { phoneSchema } from "@/validations/phoneSchema";

export const billingAccountTypeSchema = z.enum(["self_employed", "company"]);

export const billingPlanCheckoutSchema = z.object({
  account_type: billingAccountTypeSchema,
  legal_name: z
    .string()
    .trim()
    .min(2, "Introduce el nombre o la razón social")
    .max(50, "El nombre o la razón social es demasiado largo"),
  tax_id: z
    .string()
    .trim()
    .min(8, "Introduce un NIF, NIE o CIF válido")
    .max(20, "El NIF/NIE/CIF es demasiado largo"),
  commercial_name: z.string().trim().max(50, "El nombre comercial es demasiado largo").optional(),
  email: z.email("Introduce un correo válido"),
  phone: phoneSchema,
  accepted_terms: acceptedTermsSchema,
});

export type BillingPlanCheckoutFormValues = z.infer<
  typeof billingPlanCheckoutSchema
>;
