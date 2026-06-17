import { z } from "zod";

export const updateNotificationPreferencesSchema = z.object({
  saved_vehicle_reminder_days: z
    .number({ error: "Indica un número de días válido" })
    .int("Debe ser un número entero")
    .min(1, "Mínimo 1 día")
    .max(365, "Máximo 365 días"),
});

export type UpdateNotificationPreferencesFormValues = z.infer<
  typeof updateNotificationPreferencesSchema
>;
