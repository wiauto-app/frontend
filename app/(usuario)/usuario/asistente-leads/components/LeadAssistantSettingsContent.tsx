"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleHelp, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { SimpleTooltip } from "@/components/ui/simpleTooltip";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtensionSelector } from "@/components/vehicles/quick-publish/generatedDescription/extensionSelector";
import { ObjectiveSelector } from "@/components/vehicles/quick-publish/generatedDescription/objectiveSelector";
import { PersuasionSelector } from "@/components/vehicles/quick-publish/generatedDescription/persuasionSelector";
import { ToneSelector } from "@/components/vehicles/quick-publish/generatedDescription/toneSelector";
import type { LeadAssistantSettingsResponse } from "@/interfaces/lead-assistant.interface";
import { leadAssistantService } from "@/services/leadAssistantService";
import {
  LEAD_ASSISTANT_NOTIFY_TOGGLES,
  LEAD_ASSISTANT_REPLY_DELAY_OPTIONS,
} from "../constants/lead-assistant-options";
import {
  leadAssistantSettingsFormSchema,
  type LeadAssistantSettingsFormValues,
} from "../schemas/lead-assistant-settings.schema";

const SETTINGS_QUERY_KEY = ["lead-assistant", "settings"] as const;

const mapResponseToForm = (
  data: LeadAssistantSettingsResponse,
): LeadAssistantSettingsFormValues => ({
  enabled: data.enabled,
  context_note: data.context_note,
  objective: data.objective,
  persuasion: data.persuasion,
  extension: data.extension,
  tone: data.tone,
  reply_delay_seconds: data.reply_delay_seconds as LeadAssistantSettingsFormValues["reply_delay_seconds"],
  notify_on_reply: data.notify_on_reply,
  notify_on_quota_exhausted: data.notify_on_quota_exhausted,
  notify_on_hot_lead: data.notify_on_hot_lead,
});

const LabelWithTooltip = ({
  label,
  tooltip,
  htmlFor,
}: {
  label: string;
  tooltip: string;
  htmlFor?: string;
}) => (
  <div className="flex items-center gap-1.5">
    <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
    <SimpleTooltip content={tooltip}>
      <button
        type="button"
        className="inline-flex text-muted-foreground hover:text-foreground"
        aria-label={`Más información: ${label}`}
      >
        <CircleHelp className="size-4" aria-hidden />
      </button>
    </SimpleTooltip>
  </div>
);

export const LeadAssistantSettingsContent = () => {
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const response = await leadAssistantService.getSettings();
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudieron cargar los ajustes del asistente.",
        );
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

  const planIncludesAssistant =
    settingsQuery.data?.plan_includes_assistant ?? false;

  useEffect(() => {
    if (settingsQuery.data) {
      form.reset(mapResponseToForm(settingsQuery.data));
    }
  }, [form, settingsQuery.data]);

  const patchMutation = useMutation({
    mutationFn: async (values: LeadAssistantSettingsFormValues) => {
      const response = await leadAssistantService.patchSettings(values);
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudieron guardar los ajustes.",
        );
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, data);
      form.reset(mapResponseToForm(data));
      toast.success("Ajustes guardados");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (!planIncludesAssistant) {
      toast.error("Amplía tu plan para usar el asistente de leads.");
      return;
    }
    patchMutation.mutate(values);
  });

  if (settingsQuery.isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" aria-hidden />
        <span className="sr-only">Cargando ajustes</span>
      </div>
    );
  }

  if (settingsQuery.isError) {
    return (
      <p className="text-sm text-destructive">
        {settingsQuery.error instanceof Error
          ? settingsQuery.error.message
          : "No se pudieron cargar los ajustes."}
      </p>
    );
  }

  const usage = settingsQuery.data;

  return (
    <form className="mx-auto flex w-full flex-col gap-8" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Asistente de leads</h1>
        <p className="text-sm text-slate-600">
          Configura respuestas automáticas en tus chats de vehículo cuando no
          estés en la conversación.
        </p>
      </div>

      {!planIncludesAssistant ? (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <p className="font-medium">Tu plan no incluye el asistente de leads</p>
          <p className="mt-1">
            Necesitas cupos de respuestas por chat o conversaciones al mes.{" "}
            <Link href="/usuario/monetizacion" className="font-semibold underline">
              Ver planes
            </Link>
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <p>
            Respuestas por chat:{" "}
            <span className="font-medium text-foreground">
              {usage?.ai_replies_per_conversation_limit == null
                ? "Ilimitadas"
                : usage.ai_replies_per_conversation_limit}
            </span>
          </p>
          <p className="mt-1">
            Conversaciones este periodo:{" "}
            <span className="font-medium text-foreground">
              {usage?.ai_lead_conversations_used ?? 0}
              {usage?.ai_lead_conversations_limit != null
                ? ` / ${usage.ai_lead_conversations_limit}`
                : " (ilimitadas)"}
            </span>
          </p>
        </div>
      )}

      <Field>
        <div className="flex items-center justify-between gap-4">
          <div>
            <FieldLabel htmlFor="lead-assistant-enabled">Activar asistente</FieldLabel>
            <FieldDescription>
              Responde en tu nombre solo si no estás en el chat y queda cupo.
            </FieldDescription>
          </div>
          <Controller
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <Switch
                id="lead-assistant-enabled"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={!planIncludesAssistant}
              />
            )}
          />
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="context_note">Nota para el asistente</FieldLabel>
        <FieldDescription>
          Máximo 500 caracteres. La IA la usará como contexto adicional.
        </FieldDescription>
        <Textarea
          id="context_note"
          rows={3}
          maxLength={500}
          disabled={!planIncludesAssistant}
          {...form.register("context_note")}
        />
        <FieldError errors={[form.formState.errors.context_note]} />
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Controller
          control={form.control}
          name="objective"
          render={({ field }) => (
            <ObjectiveSelector
              value={field.value}
              onChange={(value) => field.onChange(value ?? field.value)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="persuasion"
          render={({ field }) => (
            <PersuasionSelector
              value={field.value}
              onChange={(value) => field.onChange(value ?? field.value)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="extension"
          render={({ field }) => (
            <ExtensionSelector
              value={field.value}
              onChange={(value) => field.onChange(value ?? field.value)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="tone"
          render={({ field }) => (
            <ToneSelector
              value={field.value}
              onChange={(value) => field.onChange(value ?? field.value)}
            />
          )}
        />
      </div>

      <Field>
        <LabelWithTooltip
          htmlFor="reply_delay_seconds"
          label="Espera antes de responder"
          tooltip="Tiempo de margen para que entres tú en el chat antes de que la IA escriba."
        />
        <Controller
          control={form.control}
          name="reply_delay_seconds"
          render={({ field }) => (
            <Select
              value={String(field.value)}
              onValueChange={(value) =>
                field.onChange(Number(value) as LeadAssistantSettingsFormValues["reply_delay_seconds"])
              }
              disabled={!planIncludesAssistant}
            >
              <SelectTrigger id="reply_delay_seconds" className="w-full">
                <SelectValue placeholder="Selecciona una espera" />
              </SelectTrigger>
              <SelectContent>
                {LEAD_ASSISTANT_REPLY_DELAY_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={String(option.value)}
                    title={option.tooltip}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldDescription>
          {LEAD_ASSISTANT_REPLY_DELAY_OPTIONS.find(
            (option) => option.value === form.watch("reply_delay_seconds"),
          )?.tooltip ?? null}
        </FieldDescription>
      </Field>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">Avisos</h2>
        {LEAD_ASSISTANT_NOTIFY_TOGGLES.map((toggle) => (
          <Field key={toggle.field}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <LabelWithTooltip
                  label={toggle.label}
                  tooltip={toggle.tooltip}
                />
                <FieldDescription>{toggle.description}</FieldDescription>
              </div>
              <Controller
                control={form.control}
                name={toggle.field}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!planIncludesAssistant}
                    aria-label={toggle.label}
                  />
                )}
              />
            </div>
          </Field>
        ))}
      </div>

      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={
          !planIncludesAssistant ||
          patchMutation.isPending ||
          form.formState.isSubmitting
        }
      >
        {patchMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Guardando…
          </>
        ) : (
          "Guardar ajustes"
        )}
      </Button>
    </form>
  );
};
