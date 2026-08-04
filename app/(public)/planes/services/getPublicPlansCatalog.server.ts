import { API_URL } from "@/constants";
import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import { V1_PUBLIC_BILLING_PLANS_CATALOG } from "@/services/billing/route.constants";

const PROFESSIONAL_AUDIENCE = "professional";

interface PublicCatalogResponse {
  ok: boolean;
  data: BillingCatalogPlan[];
}

export const getPublicPlansCatalog = async (): Promise<BillingCatalogPlan[]> => {
  if (!API_URL) {
    throw new Error("API_URL no configurada");
  }

  const url = `${API_URL.replace(/\/$/, "")}/${V1_PUBLIC_BILLING_PLANS_CATALOG}?audience=${encodeURIComponent(PROFESSIONAL_AUDIENCE)}`;

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
    .sort((left, right) => left.sort_order - right.sort_order);
};
