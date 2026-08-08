import { Check, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import { listCatalogEntitlementDisplays } from "@/lib/billing/entitlements";

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
  loading = false,
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {plans.map((plan) => {
        const monthly = plan.prices.find((price) => price.interval === "month");
        const yearly = plan.prices.find((price) => price.interval === "year");
        const primary_price = monthly ?? plan.prices[0];
        const is_active = active_plan_id === plan.id;
        const entitlementItems = listCatalogEntitlementDisplays(plan.entitlements);
        const included = (plan.features ?? []).filter((feature) => feature.included);
        const excluded = (plan.features ?? []).filter((feature) => !feature.included);

        return (
          <Card key={plan.id} className="flex flex-col gap-6 bg-white p-4">
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900 text-center">{plan.name}</h2>
              {primary_price ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-gray-700 text-center">
                    <span className="text-4xl font-bold text-blue-500">
                      {formatPrice(primary_price.amount_cents)}
                    </span>
                    {monthly ? " / mensual" : ""}
                  </p>
                  {yearly ? (
                    <p className="text-gray-700 text-center text-sm">
                      {formatPrice(yearly.amount_cents)} / año
                    </p>
                  ) : null}
                </div>
              ) : null}
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {entitlementItems.map((item) => (
                  <li key={item.feature} className="flex items-center gap-2">
                    <Check className="w-4 h-4 bg-blue-500 text-white rounded-full p-1" />
                    <p>{item.valueLabel}</p>
                  </li>
                ))}
                {included.map((feature) => (
                  <li key={feature.id} className="flex items-center gap-2">
                    <Check className="w-4 h-4 bg-blue-500 text-white rounded-full p-1" />
                    <p>{feature.label}</p>
                  </li>
                ))}
                {excluded.map((feature) => (
                  <li key={feature.id} className="flex items-center gap-2">
                    <X className="w-4 h-4 bg-gray-500 text-white rounded-full p-1" />
                    <p>{feature.label}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                type="button"
                variant="default"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
                disabled={loading || is_active || !primary_price}
                onClick={() => primary_price && onSelectPlan(plan, primary_price.id)}
              >
                {is_active ? "Plan actual" : "Cambiar plan"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default PlanesGrid;
