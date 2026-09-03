"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PlanCard } from "@/components/billing/PlanCard";
import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import type { StrapiHero } from "@/interfaces/strapi-components.interface";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/home/SectionHeading";
import { useEntitlements } from "@/hooks/useEntitlements";

interface PlansPricingSectionProps {
  actionCallSection: StrapiHero;
  plans: BillingCatalogPlan[];
  catalogError?: boolean;
}

const formatEuros = (amountCents: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);

const getPrimaryPriceId = (plan: BillingCatalogPlan): string | null => {
  const monthly = plan.prices.find((price) => price.interval === "month");
  const primaryPrice = monthly ?? plan.prices[0];

  return primaryPrice?.id ?? null;
};

export const PlansPricingSection = ({
  actionCallSection,
  plans,
  catalogError = false,
}: PlansPricingSectionProps) => {
  const router = useRouter();
  const { planName } = useEntitlements();

  const handleSelectPlan = (plan: BillingCatalogPlan) => {
    const planPriceId = getPrimaryPriceId(plan);

    if (!planPriceId) {
      toast.error("Este plan no tiene un precio de suscripción disponible");
      return;
    }

    router.push(
      `/billing-plan?plan_price_id=${encodeURIComponent(planPriceId)}`,
    );
  };

  return (
    <section className="relative overflow-hidden rounded-3xl py-8 md:py-20">
      <div className="relative container mx-auto max-w-7xl space-y-8 px-4 md:space-y-12">
        <div className="mx-auto max-w-2xl space-y-4 text-center md:space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-balance text-white md:text-4xl lg:text-6xl lg:leading-tight"></h2>
          <SectionHeading
            className="text-2xl font-bold tracking-tight text-balance  md:text-3xl lg:text-4xl lg:leading-tight"
            lead={actionCallSection?.titulo}
          />

          <p className="text-sm text-muted-foreground md:text-base">
            {actionCallSection?.descripcion}
          </p>
        </div>

        {catalogError ? (
          <div
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center text-sm text-slate-200 backdrop-blur-sm"
            role="status"
          >
            No pudimos cargar los planes en este momento. Inténtalo de nuevo más
            tarde o accede a monetización desde tu cuenta.
          </div>
        ) : null}

        {!catalogError && !plans.length ? (
          <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-10 text-center text-slate-200 backdrop-blur-sm">
            No hay planes de suscripción disponibles en este momento.
          </div>
        ) : null}

        {!catalogError && plans.length > 0 ? (
          <div
            className={cn("mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3")}
          >
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isActive={planName === plan.name}
                formatPrice={formatEuros}
                onSelect={() => {
                  handleSelectPlan(plan);
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};
