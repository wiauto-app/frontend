import { z } from "zod";

const replyDelaySchema = z.union([
  z.literal(0),
  z.literal(30),
  z.literal(60),
  z.literal(120),
  z.literal(300),
]);

export const leadAssistantSettingsFormSchema = z.object({
  enabled: z.boolean(),
  context_note: z.string().max(500, "Máximo 500 caracteres."),
  objective: z.string().min(1, "Selecciona un público objetivo."),
  persuasion: z.string().min(1, "Selecciona un nivel de persuasión."),
  extension: z.string().min(1, "Selecciona una extensión."),
  tone: z.string().min(1, "Selecciona un tono."),
  reply_delay_seconds: replyDelaySchema,
  notify_on_reply: z.boolean(),
  notify_on_quota_exhausted: z.boolean(),
  notify_on_hot_lead: z.boolean(),
});

export type LeadAssistantSettingsFormValues = z.infer<
  typeof leadAssistantSettingsFormSchema
>;
