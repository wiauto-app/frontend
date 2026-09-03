"use client";

import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import { PlanCard } from "@/components/billing/PlanCard";

interface PlanesGridProps {
  plans: BillingCatalogPlan[];
  active_plan_id: string | null;
  loading?: boolean;
  onSelectPlan: (plan: BillingCatalogPlan, price_id: string) => void;
  formatPrice: (amount_cents: number) => string;
}

const PlanesGrid = ({
  plans,
  active_plan_id,
  onSelectPlan,
  formatPrice,
}: PlanesGridProps) => {
  if (!plans.length) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 text-gray-600">
        No hay planes de suscripción disponibles para tu perfil.
      </div>
    );
  }

  const handleSelectPlan = (plan: BillingCatalogPlan) => {
    const monthly = plan.prices.find((price) => price.interval === "month");
    const primaryPrice = monthly ?? plan.prices[0];

    if (primaryPrice) {
      onSelectPlan(plan, primaryPrice.id);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isActive={active_plan_id === plan.id}
          formatPrice={formatPrice}
          onSelect={() => handleSelectPlan(plan)}
        />
      ))}
    </div>
  );
};

export default PlanesGrid;
