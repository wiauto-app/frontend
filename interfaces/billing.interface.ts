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

export type EntitlementValueType = "boolean" | "limit" | "unlimited";

export type EntitlementFeatureKey =
  | "vehicles"
  | "photos_per_vehicle"
  | "videos_per_vehicle"
  | "ai_requests"
  | "users"
  | "video_upload"
  | "ai_generation"
  | "statistics"
  | "featured_listings"
  | "dismissed_vehicles"
  | "advanced_listing_editor"
  | (string & {});

export interface EntitlementBooleanValue {
  bool: boolean;
}

export interface EntitlementLimitValue {
  limit: number;
}

export interface EntitlementUnlimitedValue {
  unlimited: true;
}

export type EntitlementValue =
  | EntitlementBooleanValue
  | EntitlementLimitValue
  | EntitlementUnlimitedValue;

export interface BillingPlanEntitlement {
  feature: EntitlementFeatureKey;
  value_type: EntitlementValueType;
  value: EntitlementValue;
}

/** @deprecated Preferir entitlements */
export interface PlanQuotas {
  max_listings: number;
  max_photos: number;
  allow_videos: boolean;
  featured_monthly?: number;
}

export interface BillingCatalogPlan {
  id: string;
  name: string;
  slug?: string | null;
  description: string | null;
  audience: string | null;
  billing_type: "recurring" | "one_time";
  type?: string;
  is_featured: boolean;
  sort_order: number;
  effect_config?: BillingPlanEffectConfig;
  plan_version_id?: string | null;
  prices: BillingPlanPrice[];
  features: BillingPlanFeature[];
  entitlements?: BillingPlanEntitlement[];
}

export interface AssistantCreditPack {
  id: string;
  title: string;
  description: string | null;
  credits_quantity: number;
  amount_cents: number;
  currency: string;
  stripe_price_id: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface FeaturedListingOffer {
  id: string;
  title: string;
  description: string | null;
  duration_days: number;
  boost_weight: number;
  amount_cents: number;
  currency: string;
  stripe_price_id: string | null;
  is_active: boolean;
  sort_order: number;
}

export type MonetizacionAddonKind = "assistant_credits" | "featured_listing";

export interface MonetizacionAddon {
  id: string;
  kind: MonetizacionAddonKind;
  title: string;
  description: string | null;
  amount_cents: number;
  currency: string;
  detail_label: string | null;
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

export interface BillingMeEntitlementEntry {
  type: EntitlementValueType;
  value: boolean;
  limit: number | null;
  used?: number;
  remaining?: number | null;
  unlimited?: boolean;
}

export interface BillingMeSubscription {
  id: string;
  plan_id: string;
  plan_name: string;
  plan_version_id?: string | null;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export interface BillingMeResponse {
  subscription: BillingMeSubscription | null;
  entitlements?: Record<string, BillingMeEntitlementEntry>;
  /** @deprecated Preferir `entitlements.vehicles.used` */
  vehicle_listings_used: number;
  /** @deprecated Preferir `entitlements.vehicles.limit` */
  vehicle_listings_max: number | null;
  /** @deprecated Preferir `entitlements` */
  quotas?: PlanQuotas;
  usage?: BillingMeUsage;
  source?: "subscription" | "dealership_owner" | "free" | "admin" | "dealership";
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
