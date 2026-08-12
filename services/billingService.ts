import { apiGet, apiPost } from "@/lib/api";
import type {
  AssistantCreditPack,
  BillingCatalogPlan,
  BillingInvoice,
  BillingMeResponse,
  CheckoutResponse,
  CreateCheckoutResult,
  FeaturedListingOffer,
  PortalResponse,
} from "@/interfaces/billing.interface";
import {
  V1_BILLING_ASSISTANT_CREDIT_PACKS_CATALOG,
  V1_BILLING_CHECKOUT_ONE_TIME,
  V1_BILLING_FEATURED_LISTING_OFFERS_CATALOG,
  V1_BILLING_INVOICES,
  V1_BILLING_ME,
  V1_BILLING_PLANS_CATALOG,
  V1_BILLING_PORTAL,
  V1_PUBLIC_BILLING_CHECKOUT_SUBSCRIPTION,
} from "@/services/billing/route.constants";

interface OneTimeCheckoutOptions {
  success_url?: string;
  cancel_url?: string;
}

interface CreateAssistantCreditsCheckoutParams extends OneTimeCheckoutOptions {
  pack_id: string;
}

interface CreateFeaturedListingCheckoutParams extends OneTimeCheckoutOptions {
  offer_id: string;
  vehicle_id: string;
}

type CreateOneTimeCheckoutParams =
  | CreateAssistantCreditsCheckoutParams
  | CreateFeaturedListingCheckoutParams;

const resolveCheckoutMessage = (message: unknown, fallback: string): string => {
  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (Array.isArray(message) && message.length > 0) {
    return String(message[0]);
  }

  return fallback;
};

const normalizeCatalogPlan = (plan: BillingCatalogPlan): BillingCatalogPlan => ({
  ...plan,
  slug: plan.slug ?? null,
  type: plan.type ?? plan.billing_type,
  plan_version_id: plan.plan_version_id ?? null,
  features: plan.features ?? [],
  entitlements: plan.entitlements ?? [],
  prices: plan.prices ?? [],
});

const createPublicSubscriptionCheckout = async (
  plan_price_id: string,
): Promise<CreateCheckoutResult> => {
  const response = await apiPost<CheckoutResponse>(V1_PUBLIC_BILLING_CHECKOUT_SUBSCRIPTION, {
    plan_price_id,
  });

  if (response.ok && response.data?.checkout_url) {
    return {
      checkoutUrl: response.data.checkout_url,
      message: null,
      status: response.status,
    };
  }

  return {
    checkoutUrl: null,
    message: resolveCheckoutMessage(
      response.message,
      "No se pudo iniciar el checkout. Inténtalo de nuevo.",
    ),
    status: response.status,
  };
};

const postOneTimeCheckout = async (
  body: Record<string, unknown>,
): Promise<string | null> => {
  const response = await apiPost<CheckoutResponse>(V1_BILLING_CHECKOUT_ONE_TIME, body);
  return response.ok ? response.data.checkout_url : null;
};

export const billingService = {
  getCatalog: async (
    billing_type?: "recurring" | "one_time",
  ): Promise<BillingCatalogPlan[]> => {
    const query = billing_type
      ? `?billing_type=${encodeURIComponent(billing_type)}`
      : "";
    const response = await apiGet<BillingCatalogPlan[]>(
      `${V1_BILLING_PLANS_CATALOG}${query}`,
    );
    return (response.data ?? []).map(normalizeCatalogPlan);
  },

  getAssistantCreditPacksCatalog: async (): Promise<AssistantCreditPack[]> => {
    const response = await apiGet<AssistantCreditPack[]>(
      V1_BILLING_ASSISTANT_CREDIT_PACKS_CATALOG,
    );
    return response.data ?? [];
  },

  getFeaturedListingOffersCatalog: async (): Promise<FeaturedListingOffer[]> => {
    const response = await apiGet<FeaturedListingOffer[]>(
      V1_BILLING_FEATURED_LISTING_OFFERS_CATALOG,
    );
    return response.data ?? [];
  },

  getMe: async (): Promise<BillingMeResponse | null> => {
    const response = await apiGet<BillingMeResponse>(V1_BILLING_ME);
    if (!response.ok || !response.data) {
      return null;
    }
 
    return {
      ...response.data,
      entitlements: response.data.entitlements ?? {},
      subscription: response.data.subscription
        ? {
          ...response.data.subscription,
          plan_version_id: response.data.subscription.plan_version_id ?? null,
        }
        : null,
    };

  },

  createSubscriptionCheckout: createPublicSubscriptionCheckout,

  createPublicSubscriptionCheckout,

  createOneTimeCheckout: async (
    params: CreateOneTimeCheckoutParams,
  ): Promise<string | null> => {
    if ("pack_id" in params) {
      return postOneTimeCheckout({
        pack_id: params.pack_id,
        ...(params.success_url ? { success_url: params.success_url } : {}),
        ...(params.cancel_url ? { cancel_url: params.cancel_url } : {}),
      });
    }

    return postOneTimeCheckout({
      offer_id: params.offer_id,
      metadata: { vehicle_id: params.vehicle_id },
      ...(params.success_url ? { success_url: params.success_url } : {}),
      ...(params.cancel_url ? { cancel_url: params.cancel_url } : {}),
    });
  },

  createAssistantCreditsCheckout: async (
    pack_id: string,
    options?: OneTimeCheckoutOptions,
  ): Promise<string | null> => {
    return billingService.createOneTimeCheckout({
      pack_id,
      ...options,
    });
  },

  createFeaturedListingCheckout: async (
    offer_id: string,
    vehicle_id: string,
    options?: OneTimeCheckoutOptions,
  ): Promise<string | null> => {
    return billingService.createOneTimeCheckout({
      offer_id,
      vehicle_id,
      ...options,
    });
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
