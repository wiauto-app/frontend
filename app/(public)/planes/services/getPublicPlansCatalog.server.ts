import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import { apiGet } from "@/lib/api";
import { V1_PUBLIC_BILLING_PLANS_CATALOG } from "@/services/billing/route.constants";



export const getPublicPlansCatalog = async (): Promise<BillingCatalogPlan[]> => {
  const response = await apiGet<BillingCatalogPlan[]>
    (V1_PUBLIC_BILLING_PLANS_CATALOG)
  const plans = response.data ?? [];

  return plans
    .filter((plan) => plan.billing_type === "recurring")
    .map((plan) => ({
      ...plan,
      slug: plan.slug ?? null,
      type: plan.type ?? plan.billing_type,
      plan_version_id: plan.plan_version_id ?? null,
      features: plan.features ?? [],
      entitlements: plan.entitlements ?? [],
      prices: plan.prices ?? [],
    }))
    .sort((left, right) => left.sort_order - right.sort_order);
};
