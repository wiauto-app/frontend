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
    <section className="relative overflow-hidden space-y-6">
      <div className="mx-auto text-center space-y-2">
        <SectionHeading
          lead={actionCallSection?.titulo}
          description={actionCallSection?.descripcion}
        />

       
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
          className={cn(
            "mx-auto grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-3 px-1",
          )}
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
    </section>
  );
};
