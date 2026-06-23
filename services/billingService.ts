import { apiGet, apiPost } from "@/lib/api";
import type {
  BillingCatalogPlan,
  BillingInvoice,
  BillingMeResponse,
  CheckoutResponse,
  PortalResponse,
} from "@/interfaces/billing.interface";
import {
  V1_BILLING_CHECKOUT_ONE_TIME,
  V1_BILLING_INVOICES,
  V1_BILLING_ME,
  V1_BILLING_PLANS_CATALOG,
  V1_BILLING_PORTAL,
  V1_PUBLIC_BILLING_CHECKOUT_SUBSCRIPTION,
} from "@/services/billing/route.constants";

const createPublicSubscriptionCheckout = async (
  plan_price_id: string,
): Promise<string | null> => {
  const response = await apiPost<CheckoutResponse>(V1_PUBLIC_BILLING_CHECKOUT_SUBSCRIPTION, {
    plan_price_id,
  });
  return response.ok ? response.data.checkout_url : null;
};

export const billingService = {
  getCatalog: async (audience?: string): Promise<BillingCatalogPlan[]> => {
    const query = audience ? `?audience=${encodeURIComponent(audience)}` : "";
    const response = await apiGet<BillingCatalogPlan[]>(
      `${V1_BILLING_PLANS_CATALOG}${query}`,
    );
    return response.data ?? [];
  },

  getMe: async (): Promise<BillingMeResponse | null> => {
    const response = await apiGet<BillingMeResponse>(V1_BILLING_ME);
    if (!response.ok) {
      return null;
    }
    return response.data;
  },

  createSubscriptionCheckout: createPublicSubscriptionCheckout,

  createPublicSubscriptionCheckout,

  createOneTimeCheckout: async (
    plan_price_id: string,
    metadata?: Record<string, string>,
    options?: {
      success_url?: string;
      cancel_url?: string;
    },
  ): Promise<string | null> => {
    const response = await apiPost<CheckoutResponse>(V1_BILLING_CHECKOUT_ONE_TIME, {
      plan_price_id,
      metadata,
      ...(options?.success_url ? { success_url: options.success_url } : {}),
      ...(options?.cancel_url ? { cancel_url: options.cancel_url } : {}),
    });
    return response.ok ? response.data.checkout_url : null;
  },

  createPortalSession: async (): Promise<string | null> => {
    const response = await apiPost<PortalResponse>(V1_BILLING_PORTAL);
    return response.ok ? response.data.portal_url : null;
  },

  getInvoices: async (): Promise<BillingInvoice[]> => {
    const response = await apiGet<BillingInvoice[]>(V1_BILLING_INVOICES);
    return response.data ?? [];
  },
};
