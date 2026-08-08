import { API_URL } from "@/constants";
import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import { V1_PUBLIC_BILLING_PLANS_CATALOG } from "@/services/billing/route.constants";

interface PublicCatalogResponse {
  ok: boolean;
  data: BillingCatalogPlan[];
}

export const getPublicPlansCatalog = async (): Promise<BillingCatalogPlan[]> => {
  if (!API_URL) {
    throw new Error("API_URL no configurada");
  }

  const url = `${API_URL.replace(/\/$/, "")}/${V1_PUBLIC_BILLING_PLANS_CATALOG}?billing_type=recurring`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudo cargar el catálogo de planes");
  }

  const body = (await response.json()) as PublicCatalogResponse;
  const plans = body.data ?? [];

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
