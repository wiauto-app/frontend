"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import type {
  BillingCatalogPlan,
  BillingPlanPrice,
} from "@/interfaces/billing.interface";
import { listCatalogEntitlementDisplays } from "@/lib/billing/entitlements";
import { cn } from "@/lib/utils";

import { PlansPricingCta } from "./PlansPricingCta";
import { StrapiHero } from "@/interfaces/strapi-components.interface";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { resolveStrapiIconName } from "../../simulador-financiamiento/utils/resolveStrapiIconName";
import { StrapiButton } from "@/components/ui/strapiButton";
import { HeroTitle } from "@/components/ui/heroTitle";
interface PlansPricingSectionProps {
  actionCallSection: StrapiHero;
  plans: BillingCatalogPlan[];
  catalogError?: boolean;
}

interface PlanPricingCardProps {
  plan: BillingCatalogPlan;
  index: number;
  prefersReducedMotion: boolean | null;
}

const INTERVAL_LABEL: Record<string, { tab: string; suffix: string }> = {
  month: { tab: "Mensual", suffix: "/ mes" },
  year: { tab: "Anual", suffix: "/ año" },
};

const formatMoney = (amountCents: number, currency: string) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency.toUpperCase() || "EUR",
  }).format(amountCents / 100);

const getRecurringPrices = (plan: BillingCatalogPlan): BillingPlanPrice[] => {
  const order = { month: 0, year: 1 };
  return plan.prices
    .filter((price) => price.interval !== "one_time")
    .sort(
      (left, right) =>
        (order[left.interval as keyof typeof order] ?? 99) -
        (order[right.interval as keyof typeof order] ?? 99),
    );
};

const getIntervalLabel = (interval: string) =>
  INTERVAL_LABEL[interval] ?? { tab: interval, suffix: `/ ${interval}` };

const getYearlySavingsLabel = (prices: BillingPlanPrice[]): string | null => {
  const month = prices.find((price) => price.interval === "month");
  const year = prices.find((price) => price.interval === "year");
  if (!month || !year) {
    return null;
  }

  const yearlyIfMonthly = month.amount_cents * 12;
  if (yearlyIfMonthly <= year.amount_cents) {
    return null;
  }

  const percent = Math.round((1 - year.amount_cents / yearlyIfMonthly) * 100);
  return percent > 0 ? `Ahorras un ${percent}%` : null;
};

const PlanPricingCard = ({
  plan,
  index,
  prefersReducedMotion,
}: PlanPricingCardProps) => {
  const prices = getRecurringPrices(plan);
  const [selectedPriceId, setSelectedPriceId] = useState(prices[0]?.id ?? null);
  const selectedPrice =
    prices.find((price) => price.id === selectedPriceId) ?? prices[0] ?? null;
  const label = selectedPrice ? getIntervalLabel(selectedPrice.interval) : null;
  const savingsLabel =
    selectedPrice?.interval === "year" ? getYearlySavingsLabel(prices) : null;

  const entitlementItems = listCatalogEntitlementDisplays(plan.entitlements);
  const includedFeatures = (plan.features ?? []).filter(
    (feature) => feature.included,
  );
  const isFeatured = plan.is_featured;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-6 text-slate-900 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.55)] transition-[transform,box-shadow] duration-300 sm:p-7",
        isFeatured
          ? "border-blue-400/80 ring-2 ring-blue-400/40"
          : "border-white/10",
      )}
    >
      {isFeatured ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-sky-400 to-blue-600"
          aria-hidden
        />
      ) : null}

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            {plan.name}
          </h3>
          {isFeatured ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
              <Sparkles className="size-3" aria-hidden />
              Más popular
            </span>
          ) : null}
        </div>
        {plan.description ? (
          <p className="text-sm leading-relaxed text-slate-600">
            {plan.description}
          </p>
        ) : null}
      </div>

      <div className="mb-6 flex flex-col gap-3">
        {prices.length > 1 ? (
          <div
            className="inline-flex w-fit rounded-full bg-slate-100 p-1"
            role="group"
            aria-label={`Periodo de facturación del plan ${plan.name}`}
          >
            {prices.map((price) => {
              const isSelected = price.id === selectedPrice?.id;
              return (
                <button
                  key={price.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedPriceId(price.id)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                    isSelected
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900",
                  )}
                >
                  {getIntervalLabel(price.interval).tab}
                </button>
              );
            })}
          </div>
        ) : null}

        {selectedPrice && label ? (
          <div>
            <p className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-slate-900 tabular-nums">
                {formatMoney(
                  selectedPrice.amount_cents,
                  selectedPrice.currency,
                )}
              </span>
              <span className="text-sm font-medium text-slate-500">
                {label.suffix}
              </span>
            </p>
            {savingsLabel ? (
              <p className="mt-1.5 text-xs font-semibold text-emerald-600">
                {savingsLabel}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-lg font-semibold text-slate-500">
            Precio a consultar
          </p>
        )}
      </div>

      <ul className="mb-8 flex flex-1 flex-col gap-3">
        {entitlementItems.map((item) => (
          <li key={item.feature} className="flex items-start gap-2.5">
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                isFeatured
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-blue-700",
              )}
              aria-hidden
            >
              <Check className="size-3 stroke-[3]" />
            </span>
            <p className="text-sm font-medium text-slate-800">
              {item.valueLabel}
            </p>
          </li>
        ))}

        {includedFeatures.map((feature) => (
          <li key={feature.id} className="flex items-start gap-2.5">
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                isFeatured
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-blue-700",
              )}
              aria-hidden
            >
              <Check className="size-3 stroke-[3]" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800">
                {feature.label}
              </p>
              {feature.description?.trim() ? (
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              ) : null}
            </div>
          </li>
        ))}

        {!entitlementItems.length && !includedFeatures.length ? (
          <li className="text-sm text-slate-500">
            Sin características listadas.
          </li>
        ) : null}
      </ul>

      <div className="mt-auto">
        <PlansPricingCta
          planName={plan.name}
          planPriceId={selectedPrice?.id ?? null}
          featured={isFeatured}
        />
      </div>
    </article>
  );
};

export const PlansPricingSection = ({
  actionCallSection,
  plans,
  catalogError = false,
}: PlansPricingSectionProps) => {
  const card = actionCallSection?.card;
  const features = actionCallSection?.caracteristicas;
  const Icon = resolveStrapiIconName(features?.[0]?.iconName ?? "");
  return (
    <section className="overflow-hidden  py-20 rounded-3x relative ">
      <Image
        src={actionCallSection?.imagen?.url ?? ""}
        alt={actionCallSection?.imagen?.alternativeText ?? ""}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
      />

      <div className="relative container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-6xl lg:leading-tight text-white">
            {actionCallSection?.titulo}
          </h2>
          <p className="mt-4 text-sm text-slate-300 md:text-base">
            {actionCallSection?.descripcion}
          </p>
        </div>

        <Card className="overflow-hidden border-2 border-primary max-w-4xl mx-auto" size="sm">
          <CardContent className="flex items-center gap-5">
            <Image
              src={card?.imagen?.url ?? ""}
              alt={card?.imagen?.alternativeText ?? ""}
              width={250}
              height={250}
              className="rounded-full"
            />
            <div className="border-l-2 border-primary h-full w-10 bg-black"></div>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-5">
                {features?.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center gap-2 p-2 bg-muted-foreground/10 rounded-full"
                  >
                    {Icon ? <Icon className="size-7 text-primary" /> : null}
                    <p>{feature.label}</p>
                  </div>
                ))}
              </div>
              {card?.boton ? (
                <StrapiButton
                  button={card?.boton}
                  className="w-full h-20 md:text-xl font-semibold"
                />
              ) : null}
              <p className="text-sm text-muted-foreground text-center">
                {card?.descripcion}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* {catalogError ? (
          <div
            className="mb-8 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center text-sm text-slate-200 backdrop-blur-sm"
            role="status"
          >
            No pudimos cargar los planes en este momento. Inténtalo de nuevo más
            tarde o accede a monetización desde tu cuenta.
          </div>
        ) : null}

        {!sortedPlans.length ? (
          <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-10 text-center text-slate-200 backdrop-blur-sm">
            No hay planes de suscripción disponibles en este momento.
          </div>
        ) : (
          <ul
            className={cn(
              "mx-auto grid list-none gap-5 p-0",
              sortedPlans.length === 1 && "max-w-md",
              sortedPlans.length === 2 && "max-w-3xl sm:grid-cols-2",
              sortedPlans.length >= 3 &&
                "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
            )}
          >
            {sortedPlans.map((plan, index) => (
              <PlanPricingCard
                key={plan.id}
                plan={plan}
                index={index}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </ul>
        )} */}
      </div>
    </section>
  );
};
