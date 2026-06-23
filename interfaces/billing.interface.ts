export type BillingPlanPrice = {
  id: string;
  interval: "month" | "year" | "one_time";
  amount_cents: number;
  currency: string;
};

export type BillingPlanFeature = {
  id: string;
  label: string;
  description: string | null;
  included: boolean;
};

export type BillingCatalogPlan = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  audience: string;
  billing_type: "recurring" | "one_time";
  is_featured: boolean;
  sort_order: number;
  prices: BillingPlanPrice[];
  features: BillingPlanFeature[];
};

export type BillingMeResponse = {
  subscription: {
    id: string;
    plan_id: string;
    plan_name: string;
    plan_slug: string;
    status: string;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
  } | null;
  effective_role: {
    id: string;
    name: string;
  } | null;
  vehicle_listings_used: number;
  vehicle_listings_max: number | null;
  stripe_customer_id: string | null;
};

export type BillingInvoice = {
  id: string;
  stripe_invoice_id: string;
  amount_paid_cents: number;
  currency: string;
  status: string;
  invoice_pdf_url: string | null;
  hosted_invoice_url: string | null;
  paid_at: string | null;
  created_at: string;
};

export type CheckoutResponse = {
  checkout_url: string;
};

export type PortalResponse = {
  portal_url: string;
};
