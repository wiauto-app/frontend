"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Landmark, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { formatPrice } from "@/app/(public)/vehiculos/utils";
import { ControlledInput } from "@/components/forms/controlledInput";
import {
  HoneypotField,
  buildHoneypotPayload,
} from "@/components/forms/HoneypotField";
import { Button } from "@/components/ui/button";
import { CustomCheckbox } from "@/components/ui/customCheckbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type {
  VehicleFinancingOffer,
  VehicleFinancingQuote,
} from "@/interfaces/financing.interface";
import { trackLead } from "@/lib/analytics/events";
import { dealershipFinancingService } from "@/services/dealershipFinancingService";
import { leadService } from "@/services/leadService";
import {
  createFinancingCalculatorSchema,
  financingRequestFormSchema,
  type FinancingCalculatorValues,
  type FinancingRequestFormValues,
} from "../schemas/financingForm.schema";
import { VehicleDetailCard } from "./VehicleDetailCard";

interface VehicleDetailDealershipFinancingProps {
  vehicleId: string;
  offer: VehicleFinancingOffer;
}

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatPercent = (value: number): string =>
  `${new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 }).format(value)} %`;

const buildFullName = (name?: string, lastName?: string): string =>
  `${name ?? ""} ${lastName ?? ""}`.trim();

interface QuoteRowProps {
  label: string;
  value: string;
  strong?: boolean;
}

const QuoteRow = ({ label, value, strong = false }: QuoteRowProps) => (
  <div className="flex items-center justify-between gap-3 text-sm">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className={strong ? "text-lg font-bold text-primary" : "font-medium"}>
      {value}
    </dd>
  </div>
);

export const VehicleDetailDealershipFinancing = ({
  vehicleId,
  offer,
}: VehicleDetailDealershipFinancingProps) => {
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [quote, setQuote] = useState<VehicleFinancingQuote | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const calculatorSchema = useMemo(
    () => createFinancingCalculatorSchema(offer),
    [offer],
  );

  const calculatorForm = useForm<FinancingCalculatorValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      down_payment_percent: offer.default_down_payment_percent,
      term_months: offer.default_term_months,
    },
  });

  const requestForm = useForm<FinancingRequestFormValues>({
    resolver: zodResolver(financingRequestFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: { phone_code: "", phone: "" },
      message: "",
      accepted_terms: false,
    },
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }
    requestForm.setValue("name", buildFullName(user.name, user.last_name));
    requestForm.setValue("email", user.email);
  }, [isAuthenticated, requestForm, user]);

  const quoteMutation = useMutation({
    mutationFn: async (values: FinancingCalculatorValues) => {
      const response = await dealershipFinancingService.quoteVehicle(
        vehicleId,
        values,
      );
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudo calcular la cuota de financiación.",
        );
      }
      return response.data;
    },
    onSuccess: (data) => setQuote(data),
    onError: (error: Error) => {
      setQuote(null);
      toast.error(error.message);
    },
  });

  const { mutate: requestQuote } = quoteMutation;

  useEffect(() => {
    requestQuote({
      down_payment_percent: offer.default_down_payment_percent,
      term_months: offer.default_term_months,
    });
  }, [offer.default_down_payment_percent, offer.default_term_months, requestQuote]);

  const handleCalculate = calculatorForm.handleSubmit((values) => {
    requestQuote(values);
  });

  const handleRequest = requestForm.handleSubmit(async (values) => {
    const calculator = await calculatorSchema.safeParseAsync(
      calculatorForm.getValues(),
    );
    if (!calculator.success) {
      toast.error("Revisa la entrada y el plazo antes de solicitar.");
      return;
    }

    const response = await leadService.createFinancing(vehicleId, {
      name: values.name,
      email: values.email,
      phone: values.phone.phone,
      phone_code: values.phone.phone_code,
      down_payment_percent: calculator.data.down_payment_percent,
      term_months: calculator.data.term_months,
      message: values.message.trim() || undefined,
      accepted_terms: values.accepted_terms,
      ...buildHoneypotPayload(honeypotRef.current?.value),
    });

    if (!response.ok) {
      toast.error(
        response.message || "No se pudo enviar la solicitud de financiación",
      );
      return;
    }

    trackLead({ contentName: "Solicitud de financiación", vehicleId });

    if (isAuthenticated && response.data?.chat_id) {
      toast.success("Solicitud enviada. Te redirigimos al chat.");
      router.push(`/usuario/mensajes?chat_id=${response.data.chat_id}`);
      return;
    }

    toast.success("Solicitud de financiación enviada");
    setShowRequestForm(false);
    requestForm.reset({
      name: isAuthenticated ? buildFullName(user?.name, user?.last_name) : "",
      email: isAuthenticated ? (user?.email ?? "") : "",
      phone: { phone_code: "", phone: "" },
      message: "",
      accepted_terms: false,
    });
  });

  return (
    <div id="financiacion" className="scroll-mt-24">
      <VehicleDetailCard
        title={
          <>
            <Landmark className="size-5 text-primary" aria-hidden />
            Financiación
          </>
        }
      >
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground">
            {offer.financial_entity
              ? `Financiación ofrecida con ${offer.financial_entity}. `
              : null}
            TIN {formatPercent(offer.tin)}
            {offer.declared_tae != null
              ? ` · TAE ${formatPercent(offer.declared_tae)}`
              : null}
            . Importe mínimo financiable: {formatPrice(offer.min_financeable_amount)}.
          </p>

          <form
            onSubmit={handleCalculate}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <Controller
              control={calculatorForm.control}
              name="down_payment_percent"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="financing-down-payment">
                    Entrada (%)
                  </FieldLabel>
                  <Input
                    id="financing-down-payment"
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    min={offer.min_down_payment_percent}
                    max={offer.max_down_payment_percent}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? Number.NaN
                          : Number(event.target.value),
                      )
                    }
                  />
                  <FieldDescription>
                    Entre {offer.min_down_payment_percent} % y{" "}
                    {offer.max_down_payment_percent} %.
                  </FieldDescription>
                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
            <Controller
              control={calculatorForm.control}
              name="term_months"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="financing-term">Plazo (meses)</FieldLabel>
                  <Input
                    id="financing-term"
                    type="number"
                    inputMode="numeric"
                    step="1"
                    min={offer.min_term_months}
                    max={offer.max_term_months}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? Number.NaN
                          : Number(event.target.value),
                      )
                    }
                  />
                  <FieldDescription>
                    Entre {offer.min_term_months} y {offer.max_term_months}{" "}
                    meses.
                  </FieldDescription>
                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
            <div className="sm:col-span-2">
              <Button
                type="submit"
                variant="outline"
                disabled={quoteMutation.isPending}
              >
                {quoteMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden />
                    Calculando...
                  </>
                ) : (
                  "Calcular financiación"
                )}
              </Button>
            </div>
          </form>

          {quote ? (
            <dl
              className="space-y-2 rounded-xl bg-muted/50 p-4"
              aria-live="polite"
            >
              <QuoteRow
                label="Cuota mensual orientativa"
                value={`${formatMoney(quote.monthly_payment)}/mes`}
                strong
              />
              <QuoteRow label="Entrada" value={formatMoney(quote.down_payment)} />
              <QuoteRow
                label="Importe financiado"
                value={formatMoney(quote.financeable_amount)}
              />
              {quote.opening_fee > 0 ? (
                <QuoteRow
                  label="Comisión de apertura"
                  value={formatMoney(quote.opening_fee)}
                />
              ) : null}
              <QuoteRow
                label="Intereses totales"
                value={formatMoney(quote.total_interest)}
              />
              <QuoteRow
                label="Total a pagar"
                value={formatMoney(quote.total_payable)}
              />
            </dl>
          ) : null}

          {offer.other_conditions ? (
            <p className="text-sm text-muted-foreground">
              {offer.other_conditions}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">{offer.legal_notice}</p>

          {showRequestForm ? (
            <form
              onSubmit={handleRequest}
              className="space-y-4 border-t border-border pt-5"
            >
              <HoneypotField
                ref={honeypotRef}
                id="vehicle-financing-hp-website"
              />
              <h3 className="font-semibold text-gray-900">
                Solicitar financiación
              </h3>
              <ControlledInput
                name="name"
                control={requestForm.control}
                label="Nombre"
                placeholder="Nombre"
              >
                {({ field, fieldState }) => (
                  <Input
                    id="financing-name"
                    name={field.name}
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    placeholder="Nombre"
                    disabled={isAuthenticated}
                    aria-invalid={fieldState.invalid}
                  />
                )}
              </ControlledInput>
              <ControlledInput
                name="email"
                control={requestForm.control}
                label="Correo electrónico"
                type="email"
              >
                {({ field, fieldState }) => (
                  <Input
                    id="financing-email"
                    type="email"
                    name={field.name}
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    placeholder="email@example.com"
                    disabled={isAuthenticated}
                    aria-invalid={fieldState.invalid}
                  />
                )}
              </ControlledInput>
              <ControlledInput
                name="phone"
                control={requestForm.control}
                label="Teléfono"
                type="phone"
              />
              <ControlledInput
                name="message"
                control={requestForm.control}
                label="Mensaje"
                type="textarea"
                placeholder="Cuéntanos algo más (opcional)"
                rows={3}
                optional
              />
              <Controller
                name="accepted_terms"
                control={requestForm.control}
                render={({ field }) => (
                  <CustomCheckbox
                    id="accept-terms-financing"
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    label="Acepto las condiciones de uso y la información básica de mis datos"
                  />
                )}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="submit"
                  disabled={requestForm.formState.isSubmitting}
                >
                  {requestForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden />
                      Enviando...
                    </>
                  ) : (
                    "Enviar solicitud"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <Button type="button" onClick={() => setShowRequestForm(true)}>
              Solicitar financiación
            </Button>
          )}
        </div>
      </VehicleDetailCard>
    </div>
  );
};
