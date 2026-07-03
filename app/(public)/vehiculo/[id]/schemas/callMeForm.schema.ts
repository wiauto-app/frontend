import { z } from "zod";
import { acceptedTermsSchema } from "@/validations/acceptedTermsSchema";
import { phoneSchema } from "@/validations/phoneSchema";

const getTodayIsoDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0]!;
};

const callbackScheduledAtSchema = z
  .string()
  .min(1, "La fecha es requerida")
  .refine((value) => value >= getTodayIsoDate(), {
    message: "La fecha debe ser hoy o posterior",
  });

export const guestCallMeFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phone: phoneSchema,
  callback_scheduled_at: callbackScheduledAtSchema,
  accepted_terms: acceptedTermsSchema,
});

export const authenticatedCallMeFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phone: phoneSchema,
  callback_scheduled_at: callbackScheduledAtSchema,
  accepted_terms: acceptedTermsSchema,
});

export type GuestCallMeFormValues = z.infer<typeof guestCallMeFormSchema>;
export type AuthenticatedCallMeFormValues = z.infer<
  typeof authenticatedCallMeFormSchema
>;
