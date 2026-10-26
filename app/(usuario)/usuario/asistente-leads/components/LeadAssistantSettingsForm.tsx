"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { leadAssistantService } from "@/services/leadAssistantService";
import {
  leadAssistantSettingsFormSchema,
  REPLY_DELAY_OPTIONS,
  type LeadAssistantSettingsFormValues,
} from "../schemas/lead-assistant-settings.schema";

const REPLY_DELAY_LABELS: Record<(typeof REPLY_DELAY_OPTIONS)[number], string> =
  {
    0: "Al momento",
    30: "30 segundos",
    60: "1 minuto",
    120: "2 minutos",
    300: "5 minutos",
  };

const OBJECTIVE_OPTIONS = [
  { value: "anyone", label: "Público general" },
  { value: "family", label: "Familias" },
  { value: "young", label: "Jóvenes" },
  { value: "first-car", label: "Primer coche" },
  { value: "business", label: "Uso profesional" },
  { value: "fuel-saver", label: "Ahorro de combustible" },
];

const PERSUASION_OPTIONS = [
  { value: "informative", label: "Informativo" },
  { value: "balanced", label: "Equilibrado" },
  { value: "persuasive", label: "Persuasivo" },
  { value: "very-seller", label: "Muy comercial" },
];

const TONE_OPTIONS = [
  { value: "professional", label: "Profesional" },
  { value: "friendly", label: "Cercano" },
  { value: "formal", label: "Formal" },
  { value: "enthusiastic", label: "Entusiasta" },
];

const EXTENSION_OPTIONS = [
  { value: "short", label: "Respuesta corta" },
  { value: "medium", label: "Respuesta media" },
  { value: "very-short", label: "Muy breve" },
];

interface NotifySwitchProps {
  label: string;
  tooltip: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const NotifySwitch = ({
  label,
  tooltip,
  checked,
  onCheckedChange,
}: NotifySwitchProps) => (
  <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
    <div className="flex min-w-0 items-center gap-2">
      <FieldLabel className="text-sm font-medium">{label}</FieldLabel>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                className="text-muted-foreground"
                aria-label={`Más información: ${label}`}
              />
            }
          >
            <Info className="size-4" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-sm">{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
  </div>
);

export const LeadAssistantSettingsForm = () => {
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({
    queryKey: ["lead-assistant-settings"],
    queryFn: async () => {
      const response = await leadAssistantService.getSettings();
      if (!response.ok || !response.data) {
        throw new Error(response.message ?? "No se pudieron cargar los ajustes");
      }
      return response.data;
    },
  });

  const form = useForm<LeadAssistantSettingsFormValues>({
    resolver: zodResolver(leadAssistantSettingsFormSchema),
    defaultValues: {
      enabled: false,
      context_note: "",
      objective: "anyone",
      persuasion: "balanced",
      extension: "medium",
      tone: "professional",
      reply_delay_seconds: 30,
      notify_on_reply: true,
      notify_on_quota_exhausted: true,
      notify_on_hot_lead: true,
    },
  });

  useEffect(() => {
    if (!settingsQuery.data) {
      return;
    }
    form.reset({
      enabled: settingsQuery.data.enabled,
      context_note: settingsQuery.data.context_note,
      objective: settingsQuery.data.objective,
      persuasion: settingsQuery.data.persuasion,
      extension: settingsQuery.data.extension,
      tone: settingsQuery.data.tone,
      reply_delay_seconds: settingsQuery.data.reply_delay_seconds as LeadAssistantSettingsFormValues["reply_delay_seconds"],
      notify_on_reply: settingsQuery.data.notify_on_reply,
      notify_on_quota_exhausted: settingsQuery.data.notify_on_quota_exhausted,
      notify_on_hot_lead: settingsQuery.data.notify_on_hot_lead,
    });
  }, [settingsQuery.data, form]);

  const mutation = useMutation({
    mutationFn: async (values: LeadAssistantSettingsFormValues) => {
      const response = await leadAssistantService.patchSettings(values);
      if (!response.ok || !response.data) {
        throw new Error(response.message ?? "No se pudieron guardar los ajustes");
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["lead-assistant-settings"], data);
      toast.success("Ajustes guardados");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const planIncludes = settingsQuery.data?.plan_includes_assistant ?? false;

  const handleSubmit = form.handleSubmit((values) => {
    if (!planIncludes) {
      toast.error("Amplía tu plan para usar el asistente de leads.");
      return;
    }
    mutation.mutate(values);
  });

  if (settingsQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando ajustes…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-6">
      {!planIncludes ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Tu plan no incluye respuestas automáticas en el chat. Amplía el plan en
          Monetización para activar el asistente de leads.
        </p>
      ) : null}

      <Field>
        <div className="flex items-center justify-between gap-4">
          <FieldLabel>Activar asistente de leads</FieldLabel>
          <Controller
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={!planIncludes}
                aria-label="Activar asistente de leads"
              />
            )}
          />
        </div>
        <FieldDescription>
          Responde en tu nombre cuando no estés en el chat, dentro de los cupos de tu plan.
        </FieldDescription>
      </Field>

      <Field>
        <FieldLabel>Nota para el asistente</FieldLabel>
        <Controller
          control={form.control}
          name="context_note"
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                maxLength={500}
                disabled={!planIncludes}
                placeholder="Ej.: Solo entrego con ITV en regla"
                aria-invalid={Boolean(fieldState.error)}
              />
              {fieldState.error ? (
                <FieldDescription className="text-destructive">
                  {fieldState.error.message}
                </FieldDescription>
              ) : null}
            </>
          )}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["objective", OBJECTIVE_OPTIONS, "Público objetivo"],
            ["persuasion", PERSUASION_OPTIONS, "Estilo comercial"],
            ["tone", TONE_OPTIONS, "Tono"],
            ["extension", EXTENSION_OPTIONS, "Longitud de respuesta"],
          ] as const
        ).map(([name, options, label]) => (
          <Field key={name}>
            <FieldLabel>{label}</FieldLabel>
            <Controller
              control={form.control}
              name={name}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!planIncludes}
                >
                  <SelectTrigger aria-label={label}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        ))}
      </div>

      <Field>
        <FieldLabel>Espera antes de responder</FieldLabel>
        <Controller
          control={form.control}
          name="reply_delay_seconds"
          render={({ field }) => (
            <Select
              value={String(field.value)}
              onValueChange={(value) => field.onChange(Number(value))}
              disabled={!planIncludes}
            >
              <SelectTrigger aria-label="Espera antes de responder">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPLY_DELAY_OPTIONS.map((seconds) => (
                  <SelectItem key={seconds} value={String(seconds)}>
                    {REPLY_DELAY_LABELS[seconds]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <div className="flex flex-col gap-3">
        <Controller
          control={form.control}
          name="notify_on_reply"
          render={({ field }) => (
            <NotifySwitch
              label="Avisar cuando el asistente responda"
              tooltip="Recibirás una notificación con un extracto del mensaje enviado al comprador."
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Controller
          control={form.control}
          name="notify_on_quota_exhausted"
          render={({ field }) => (
            <NotifySwitch
              label="Avisar si se agota el cupo"
              tooltip="Te avisamos una vez por chat y periodo cuando la IA no pueda responder por límite del plan."
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Controller
          control={form.control}
          name="notify_on_hot_lead"
          render={({ field }) => (
            <NotifySwitch
              label="Avisar cuando el lead parezca listo para cerrar"
              tooltip="Señal cuando piden visita, reserva, financiación, prueba o muestran intención clara de compra. No garantiza la venta."
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      <Button type="submit" disabled={!planIncludes || mutation.isPending}>
        Guardar ajustes
      </Button>
    </form>
  );
};
