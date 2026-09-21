"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PlanCard } from "@/components/billing/PlanCard";
import { SectionHeading } from "@/components/home/SectionHeading";
import { IconContainer } from "@/components/ui/iconContainer";
import { useEntitlements } from "@/hooks/useEntitlements";
import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import type { StrapiHero } from "@/interfaces/strapi-components.interface";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";
import { cn } from "@/lib/utils";

import { plansIconPack } from "../utils/plansIconPack";

interface PlansPricingSectionProps {
  actionCallSection: StrapiHero;
  plans: BillingCatalogPlan[];
  catalogError?: boolean;
  /** Frontend-only launch promo on plan cards. Checkout still uses the real Stripe price. */
  showDiscount?: boolean;
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
  showDiscount = true,
}: PlansPricingSectionProps) => {
  const router = useRouter();
  const { planName } = useEntitlements();
  const features = actionCallSection.caracteristicas ?? [];

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
    <section className="relative space-y-6 overflow-hidden">
      <div className="mx-auto space-y-4 text-center">
        <SectionHeading
          lead={actionCallSection?.titulo}
          description={actionCallSection?.descripcion}
        />

        {features.length > 0 ? (
          <ul className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {features.map((feature) => {
              const Icon = resolveStrapiIconName(
                feature.iconName,
                plansIconPack,
              );

              return (
                <li
                  key={feature.id}
                  className="flex items-center gap-2 text-left"
                >
                  {Icon ? (
                    <IconContainer Icon={Icon} justIcon className="text-primary" />
                  ) : null}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      {feature.label}
                    </p>
                    {feature.descripcion ? (
                      <p className="text-xs text-muted-foreground">
                        {feature.descripcion}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
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
            "mx-auto grid gap-2 px-1 py-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isActive={planName === plan.name}
              formatPrice={formatEuros}
              showDiscount={showDiscount}
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
