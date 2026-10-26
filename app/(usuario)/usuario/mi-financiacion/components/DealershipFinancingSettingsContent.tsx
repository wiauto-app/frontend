"use client";

import { useEffect } from "react";
import {
  Controller,
  useForm,
  type Control,
  type FieldPath,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type {
  DealershipFinancingSettings,
  PatchDealershipFinancingSettingsPayload,
} from "@/interfaces/financing.interface";
import {
  DEALERSHIP_FINANCING_SETTINGS_QUERY_KEY,
  dealershipFinancingService,
} from "@/services/dealershipFinancingService";
import {
  dealershipFinancingSettingsFormSchema,
  type DealershipFinancingSettingsFormValues,
} from "../schemas/dealership-financing-settings.schema";

const DEFAULT_VALUES: DealershipFinancingSettingsFormValues = {
  enabled: false,
  financial_entity: "",
  tin: 0,
  declared_tae: null,
  min_term_months: 12,
  max_term_months: 84,
  default_term_months: 60,
  min_down_payment_percent: 10,
  max_down_payment_percent: 50,
  default_down_payment_percent: 20,
  min_financeable_amount: 3000,
  opening_fee_percent: 0,
  opening_fee_fixed: null,
  other_conditions: "",
};

const mapResponseToForm = (
  data: DealershipFinancingSettings,
): DealershipFinancingSettingsFormValues => ({
  enabled: data.enabled,
  financial_entity: data.financial_entity ?? "",
  tin: data.tin,
  declared_tae: data.declared_tae,
  min_term_months: data.min_term_months,
  max_term_months: data.max_term_months,
  default_term_months: data.default_term_months,
  min_down_payment_percent: data.min_down_payment_percent,
  max_down_payment_percent: data.max_down_payment_percent,
  default_down_payment_percent: data.default_down_payment_percent,
  min_financeable_amount: data.min_financeable_amount,
  opening_fee_percent: data.opening_fee_percent,
  opening_fee_fixed: data.opening_fee_fixed,
  other_conditions: data.other_conditions ?? "",
});

const mapFormToPayload = (
  values: DealershipFinancingSettingsFormValues,
): PatchDealershipFinancingSettingsPayload => ({
  ...values,
  financial_entity: values.financial_entity.trim() || null,
  other_conditions: values.other_conditions.trim() || null,
});

interface NumberFieldProps {
  control: Control<DealershipFinancingSettingsFormValues>;
  name: FieldPath<DealershipFinancingSettingsFormValues>;
  label: string;
  description?: string;
  suffix?: string;
  step?: string;
  /** Si es `true`, el campo vacío se guarda como `null`. */
  nullable?: boolean;
}

const NumberField = ({
  control,
  name,
  label,
  description,
  suffix,
  step = "1",
  nullable = false,
}: NumberFieldProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
        <div className="relative">
          <Input
            id={name}
            type="number"
            inputMode="decimal"
            step={step}
            min={0}
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            aria-invalid={fieldState.invalid}
            value={
              typeof field.value === "number" && !Number.isNaN(field.value)
                ? field.value
                : ""
            }
            onChange={(event) => {
              const raw = event.target.value;
              if (raw === "") {
                field.onChange(nullable ? null : Number.NaN);
                return;
              }
              field.onChange(Number(raw));
            }}
            className={suffix ? "pr-14" : undefined}
          />
          {suffix ? (
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
              {suffix}
            </span>
          ) : null}
        </div>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
        {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
      </Field>
    )}
  />
);

export const DealershipFinancingSettingsContent = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const membership = user?.dealership_membership ?? null;
  const canManage =
    membership?.role === "owner" || membership?.role === "admin";

  const settingsQuery = useQuery({
    queryKey: DEALERSHIP_FINANCING_SETTINGS_QUERY_KEY,
    enabled: canManage,
    retry: false,
    queryFn: async () => {
      const response = await dealershipFinancingService.getSettings();
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudieron cargar las condiciones.",
        );
      }
      return response.data;
    },
  });

  const form = useForm<DealershipFinancingSettingsFormValues>({
    resolver: zodResolver(dealershipFinancingSettingsFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (settingsQuery.data) {
      form.reset(mapResponseToForm(settingsQuery.data));
    }
  }, [form, settingsQuery.data]);

  const patchMutation = useMutation({
    mutationFn: async (values: DealershipFinancingSettingsFormValues) => {
      const response = await dealershipFinancingService.patchSettings(
        mapFormToPayload(values),
      );
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudieron guardar las condiciones.",
        );
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(DEALERSHIP_FINANCING_SETTINGS_QUERY_KEY, data);
      form.reset(mapResponseToForm(data));
      toast.success("Condiciones de financiación guardadas");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = form.handleSubmit((values) => patchMutation.mutate(values));

  if (!canManage) {
    return (
      <p className="text-sm text-muted-foreground">
        Solo el propietario o los administradores del concesionario pueden
        gestionar la financiación.
      </p>
    );
  }

  if (settingsQuery.isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" aria-hidden />
        <span className="sr-only">Cargando condiciones</span>
      </div>
    );
  }

  if (settingsQuery.isError) {
    return (
      <p className="text-sm text-destructive">
        {settingsQuery.error instanceof Error
          ? settingsQuery.error.message
          : "No se pudieron cargar las condiciones."}
      </p>
    );
  }

  return (
    <form className="mx-auto flex w-full flex-col gap-8" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Mi financiación</h1>
        <p className="text-sm text-slate-600">
          Define las condiciones que verán los compradores en los vehículos de
          tu concesionario que marques como «Ofrecer financiación». WiAuto no
          concede financiación: las cuotas son orientativas y la solicitud llega
          a tu concesionario como contacto.
        </p>
      </div>

      <Field>
        <div className="flex items-center justify-between gap-4">
          <div>
            <FieldLabel htmlFor="financing-enabled">
              Activar financiación
            </FieldLabel>
            <FieldDescription>
              Si la desactivas, los anuncios dejan de mostrar la cuota propia y
              vuelven a la financiación del catálogo.
            </FieldDescription>
          </div>
          <Controller
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <Switch
                id="financing-enabled"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </Field>

      <Controller
        control={form.control}
        name="financial_entity"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="financial_entity">Entidad financiera</FieldLabel>
            <Input
              id="financial_entity"
              maxLength={120}
              placeholder="Ej. Banco Santander Consumer"
              aria-invalid={fieldState.invalid}
              {...field}
            />
            {fieldState.error ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        )}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <NumberField
          control={form.control}
          name="tin"
          label="TIN"
          suffix="%"
          step="0.01"
          description="Tipo de interés nominal anual."
        />
        <NumberField
          control={form.control}
          name="declared_tae"
          label="TAE (opcional)"
          suffix="%"
          step="0.01"
          nullable
          description="Solo informativa; el cálculo usa el TIN."
        />
        <NumberField
          control={form.control}
          name="min_term_months"
          label="Plazo mínimo"
          suffix="meses"
        />
        <NumberField
          control={form.control}
          name="max_term_months"
          label="Plazo máximo"
          suffix="meses"
        />
        <NumberField
          control={form.control}
          name="default_term_months"
          label="Plazo por defecto"
          suffix="meses"
        />
        <NumberField
          control={form.control}
          name="min_financeable_amount"
          label="Importe mínimo financiable"
          suffix="€"
          description="Por debajo de este importe no se ofrece cuota."
        />
        <NumberField
          control={form.control}
          name="min_down_payment_percent"
          label="Entrada mínima"
          suffix="%"
          step="0.01"
        />
        <NumberField
          control={form.control}
          name="max_down_payment_percent"
          label="Entrada máxima"
          suffix="%"
          step="0.01"
        />
        <NumberField
          control={form.control}
          name="default_down_payment_percent"
          label="Entrada por defecto"
          suffix="%"
          step="0.01"
          description="Se usa también para calcular la cuota «desde»."
        />
        <NumberField
          control={form.control}
          name="opening_fee_percent"
          label="Comisión de apertura"
          suffix="%"
          step="0.01"
        />
        <NumberField
          control={form.control}
          name="opening_fee_fixed"
          label="Comisión fija (opcional)"
          suffix="€"
          step="0.01"
          nullable
        />
      </div>

      <Controller
        control={form.control}
        name="other_conditions"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="other_conditions">Otras condiciones</FieldLabel>
            <FieldDescription>
              Se mostrará al comprador en la ficha del vehículo. Máximo 1000
              caracteres.
            </FieldDescription>
            <Textarea
              id="other_conditions"
              rows={3}
              maxLength={1000}
              aria-invalid={fieldState.invalid}
              {...field}
            />
            {fieldState.error ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        )}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={patchMutation.isPending}>
          {patchMutation.isPending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Guardando...
            </>
          ) : (
            "Guardar condiciones"
          )}
        </Button>
      </div>
    </form>
  );
};
