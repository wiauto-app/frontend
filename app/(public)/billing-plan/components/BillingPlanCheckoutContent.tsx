"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  Loader2,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { TbCarGarage } from "react-icons/tb";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { ControlledInput } from "@/components/forms/controlledInput";
import {
  DEFAULT_PHONE_CODE,
  PhoneInput,
  type PhoneFieldValue,
} from "@/components/forms/phoneInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomCheckbox } from "@/components/ui/customCheckbox";
import { FieldError } from "@/components/ui/field";
import type {
  BillingAccountType,
  BillingCatalogPlan,
} from "@/interfaces/billing.interface";
import { rememberPendingPurchase } from "@/lib/analytics/events";
import { listCatalogEntitlementDisplays } from "@/lib/billing/entitlements";
import { cn } from "@/lib/utils";
import { billingService } from "@/services/billingService";
import {
  billingPlanCheckoutSchema,
  type BillingPlanCheckoutFormValues,
} from "../schemas/billingPlanCheckout.schema";

interface BillingPlanCheckoutContentProps {
  planPriceId: string;
}

interface AccountTypeOption {
  value: BillingAccountType;
  title: string;
  description: string;
  icon: typeof User;
}

const IVA_RATE = 0.21;

const ACCOUNT_TYPE_OPTIONS: AccountTypeOption[] = [
  {
    value: "self_employed",
    title: "Autónomo / Persona física",
    description: "Opero como autónomo o persona física.",
    icon: User,
  },
  {
    value: "company",
    title: "Empresa / Sociedad",
    description: "Tengo una empresa o sociedad constituida.",
    icon: Building2,
  },
];

const formatEuros = (amountCents: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);

const findPlanByPriceId = (
  plans: BillingCatalogPlan[],
  planPriceId: string,
): {
  plan: BillingCatalogPlan;
  price: BillingCatalogPlan["prices"][number];
} | null => {
  for (const plan of plans) {
    const price = plan.prices.find((item) => item.id === planPriceId);
    if (price) {
      return { plan, price };
    }
  }

  return null;
};

const getIntervalCopy = (interval: BillingCatalogPlan["prices"][number]["interval"]) => {
  if (interval === "year") {
    return {
      publication: "Publicación anual",
      suffix: "año",
      totalLabel: "Total anual",
      renewalTitle: "Renovación anual",
      renewalBody:
        "Tu suscripción se renovará automáticamente cada año. Puedes cancelar cuando quieras.",
    };
  }

  if (interval === "month") {
    return {
      publication: "Publicación mensual",
      suffix: "mes",
      totalLabel: "Total mensual",
      renewalTitle: "Renovación mensual",
      renewalBody:
        "Tu suscripción se renovará automáticamente cada mes. Puedes cancelar cuando quieras.",
    };
  }

  return {
    publication: "Pago único",
    suffix: "pago único",
    totalLabel: "Total",
    renewalTitle: "Pago único",
    renewalBody: "Este cargo no se renueva de forma automática.",
  };
};

const defaultValues: BillingPlanCheckoutFormValues = {
  account_type: "self_employed",
  legal_name: "",
  tax_id: "",
  commercial_name: "",
  email: "",
  phone: {
    phone_code: DEFAULT_PHONE_CODE,
    phone: "",
  },
  accepted_terms: false,
};

export const BillingPlanCheckoutContent = ({
  planPriceId,
}: BillingPlanCheckoutContentProps) => {
  const { user } = useUser();
  const form = useForm<BillingPlanCheckoutFormValues>({
    resolver: zodResolver(billingPlanCheckoutSchema),
    defaultValues,
  });

  const accountType = form.watch("account_type");

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!form.getValues("email")) {
      form.setValue("email", user.email ?? "", { shouldDirty: false });
    }

    const currentPhone = form.getValues("phone");
    if (!currentPhone.phone) {
      form.setValue(
        "phone",
        {
          phone_code: user.phone_code?.trim() || currentPhone.phone_code || DEFAULT_PHONE_CODE,
          phone: user.phone ?? "",
        },
        { shouldDirty: false },
      );
    }
  }, [form, user]);

  const { data: plans = [], isLoading: catalogLoading } = useQuery({
    queryKey: ["billing-catalog", "recurring"],
    queryFn: () => billingService.getCatalog("recurring"),
  });

  const selected = findPlanByPriceId(plans, planPriceId);
  const entitlementItems = selected
    ? listCatalogEntitlementDisplays(selected.plan.entitlements)
    : [];
  const includedFeatures = (selected?.plan.features ?? []).filter(
    (feature) => feature.included,
  );
  const intervalCopy = selected
    ? getIntervalCopy(selected.price.interval)
    : null;
  const subtotalCents = selected?.price.amount_cents ?? 0;
  const ivaCents = Math.round(subtotalCents * IVA_RATE);
  const totalCents = subtotalCents + ivaCents;

  const handleAccountTypeKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    value: BillingAccountType,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    form.setValue("account_type", value, { shouldValidate: true });
  };

  const handleSubmit = async (data: BillingPlanCheckoutFormValues) => {
    const commercialName = data.commercial_name?.trim();
    const phoneCode = data.phone.phone_code?.trim();
    const phone = data.phone.phone?.trim();

    const result = await billingService.createSubscriptionCheckout({
      plan_price_id: planPriceId,
      account_type: data.account_type,
      legal_name: data.legal_name.trim(),
      tax_id: data.tax_id.trim().toUpperCase(),
      ...(commercialName ? { commercial_name: commercialName } : {}),
      accepted_terms: true,
      email: data.email.trim(),
      ...(phoneCode ? { phone_code: phoneCode } : {}),
      ...(phone ? { phone } : {}),
    });

    if (!result.checkoutUrl) {
      if (result.status === 403) {
        toast.error(
          result.message ?? "No tienes permiso para contratar este plan.",
        );
        return;
      }

      toast.error(
        result.message ?? "No se pudo iniciar el checkout. Inténtalo de nuevo.",
      );
      return;
    }

    if (selected) {
      rememberPendingPurchase({
        value: selected.price.amount_cents / 100,
        currency: selected.price.currency.toUpperCase(),
        contentName: selected.plan.name,
        contentIds: [selected.plan.id],
      });
    }

    window.location.href = result.checkoutUrl;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.8fr)] lg:items-start">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Completa tus datos para continuar
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Necesitamos algunos datos básicos para crear tu cuenta profesional y
            emitir tu factura.
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(handleSubmit)}
          aria-label="Formulario de datos fiscales para contratar el plan"
        >
          <Controller
            name="account_type"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-3">
                <p className="text-sm font-medium" id="account-type-label">
                  Tipo de profesional
                </p>
                <div
                  role="radiogroup"
                  aria-labelledby="account-type-label"
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {ACCOUNT_TYPE_OPTIONS.map((option) => {
                    const isSelected = field.value === option.value;
                    const Icon = option.icon;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        tabIndex={0}
                        aria-checked={isSelected}
                        aria-label={option.title}
                        onClick={() => field.onChange(option.value)}
                        onKeyDown={(event) => {
                          handleAccountTypeKeyDown(event, option.value);
                        }}
                        className={cn(
                          "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/40",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                            isSelected
                              ? "border-primary"
                              : "border-muted-foreground/40",
                          )}
                          aria-hidden
                        >
                          {isSelected ? (
                            <span className="size-2 rounded-full bg-primary" />
                          ) : null}
                        </span>
                        <Icon
                          className="mt-0.5 size-5 shrink-0 text-primary"
                          aria-hidden
                        />
                        <span className="space-y-1">
                          <span className="block text-sm font-semibold">
                            {option.title}
                          </span>
                          <span className="block text-sm text-muted-foreground">
                            {option.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          />

          <ControlledInput
            name="commercial_name"
            control={form.control}
            label="Nombre comercial"
            optional
            placeholder="Ej: Coches Premium Zaragoza"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <ControlledInput
              name="legal_name"
              control={form.control}
              label={
                accountType === "company"
                  ? "Razón social"
                  : "Nombre y apellidos"
              }
              placeholder={
                accountType === "company"
                  ? "Ej: Concesionario WiAuto S.L."
                  : "Ej: Juan Pérez García"
              }
            />

            <ControlledInput
              name="tax_id"
              control={form.control}
              label="NIF / NIE / CIF"
              placeholder="Ej: 12345678X"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ControlledInput
              name="email"
              control={form.control}
              label="Email"
              type="email"
              placeholder="Ej: juanperez@gmail.com"
            />

            <ControlledInput
              name="phone"
              control={form.control}
              label="Teléfono"
            >
              {({ field, fieldState }) => (
                <PhoneInput
                  value={field.value as PhoneFieldValue}
                  onChange={field.onChange}
                  ariaInvalid={fieldState.invalid}
                  nationalNumberPlaceholder="600 123 456"
                />
              )}
            </ControlledInput>
          </div>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="size-4 shrink-0" aria-hidden />
            Tus datos están protegidos. No compartimos tu información.
          </p>

          <Controller
            name="accepted_terms"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <CustomCheckbox
                  id="billing-plan-accepted-terms"
                  checked={field.value}
                  onChange={(event) => {
                    field.onChange(event.target.checked);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  label={
                    <span>
                      Acepto los{" "}
                      <Link
                        href="/terminos"
                        className="underline underline-offset-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        términos y condiciones
                      </Link>{" "}
                      de la suscripción profesional
                    </span>
                  }
                />
                {fieldState.error ? (
                  <FieldError>{fieldState.error.message}</FieldError>
                ) : null}
              </div>
            )}
          />

          <div className="space-y-2">
            <Button
              type="submit"
              className="h-12 w-full text-base"
              disabled={form.formState.isSubmitting || catalogLoading}
              aria-busy={form.formState.isSubmitting}
              aria-label="Continuar al pago"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  Redirigiendo...
                </>
              ) : (
                <>
                  Continuar al pago
                  <Lock className="size-4" aria-hidden />
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Te llevará a Stripe para completar el pago de forma segura.
            </p>
          </div>
        </form>
      </div>

      <Card size="sm" className="h-fit lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle>Resumen de tu plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {catalogLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Cargando plan...
            </div>
          ) : null}

          {!catalogLoading && !selected ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                No encontramos el plan seleccionado. Vuelve a la página de
                planes e inténtalo de nuevo.
              </p>
              <Button variant="outline" render={<Link href="/planes" />}>
                Ver planes
              </Button>
            </div>
          ) : null}

          {selected && intervalCopy ? (
            <>
              <div className="space-y-3">
                <TbCarGarage className="size-10 text-primary" aria-hidden />
                <div className="space-y-1">
                  <p className="text-xl font-bold">{selected.plan.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {intervalCopy.publication}
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {formatEuros(selected.price.amount_cents)}
                    <span className="text-base font-normal text-muted-foreground">
                      {" "}
                      /{intervalCopy.suffix}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    IVA no incluido
                  </p>
                </div>
                {selected.plan.description ? (
                  <p className="text-sm text-muted-foreground">
                    {selected.plan.description}
                  </p>
                ) : null}
              </div>

              {entitlementItems.length > 0 || includedFeatures.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Incluye:</p>
                  <ul className="space-y-2">
                    {entitlementItems.map((item) => (
                      <li
                        key={item.feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <HiOutlineCheckCircle
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          aria-hidden
                        />
                        <span>{item.valueLabel}</span>
                      </li>
                    ))}
                    {includedFeatures.map((feature) => (
                      <li
                        key={feature.id}
                        className="flex items-start gap-2 text-sm"
                      >
                        <HiOutlineCheckCircle
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          aria-hidden
                        />
                        <span>{feature.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="space-y-2 border-t pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatEuros(subtotalCents)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">IVA (21%)</span>
                  <span>{formatEuros(ivaCents)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>{intervalCopy.totalLabel}</span>
                  <span>{formatEuros(totalCents)}</span>
                </div>
                <p className="text-xs text-muted-foreground">IVA incluido</p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-primary/5 p-4">
                <Calendar
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden
                />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    {intervalCopy.renewalTitle}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {intervalCopy.renewalBody}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-4 shrink-0" aria-hidden />
                  Pago 100% seguro con Stripe
                </p>
                <p className="text-xs font-medium tracking-wide text-muted-foreground">
                  Stripe · VISA · Mastercard · AMEX
                </p>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
