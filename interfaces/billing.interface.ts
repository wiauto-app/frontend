export interface BillingPlanPrice {
  id: string;
  interval: "month" | "year" | "one_time";
  amount_cents: number;
  currency: string;
}

export interface BillingPlanFeature {
  id: string;
  label: string;
  description: string | null;
  included: boolean;
}

export interface BillingPlanEffectConfig {
  type?: "assistant_credits" | "feature_vehicle";
  credits?: number;
}

export interface PlanQuotas {
  max_listings: number;
  max_photos: number;
  allow_videos: boolean;
  featured_monthly?: number;
}

export interface BillingCatalogPlan {
  id: string;
  name: string;
  description: string | null;
  audience: string;
  billing_type: "recurring" | "one_time";
  is_featured: boolean;
  /** Plan personalizado: no debe mostrarse en catálogo público. */
  is_custom?: boolean;
  quotas?: PlanQuotas;
  sort_order: number;
  effect_config?: BillingPlanEffectConfig;
  prices: BillingPlanPrice[];
  features: BillingPlanFeature[];
}

export interface AssistantQuotaResponse {
  monthlyFreeLimit: number;
  monthlyFreeRemaining: number;
  purchasedCredits: number;
  totalRemaining: number;
}

export interface BillingMeUsage {
  listings_used: number;
  listings_scope: "dealership" | "profile";
  dealership_id?: string | null;
}

export interface BillingMeResponse {
  subscription: {
    id: string;
    plan_id: string;
    plan_name: string;
    status: string;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
  } | null;
  effective_role: {
    id: string;
    name: string;
  } | null;
  /** @deprecated Preferir `usage.listings_used` */
  vehicle_listings_used: number;
  /** @deprecated Preferir `quotas.max_listings` */
  vehicle_listings_max: number | null;
  quotas?: PlanQuotas;
  usage?: BillingMeUsage;
  source?: "dealership_plan" | "own_subscription" | "free";
  plan_id?: string | null;
  stripe_customer_id: string | null;
}

export interface BillingInvoice {
  id: string;
  stripe_invoice_id: string;
  amount_paid_cents: number;
  currency: string;
  status: string;
  invoice_pdf_url: string | null;
  hosted_invoice_url: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface CheckoutResponse {
  checkout_url: string;
}

export interface PortalResponse {
  portal_url: string;
}

export interface CreateCheckoutResult {
  checkoutUrl: string | null;
  message: string | null;
  status: number;
}
