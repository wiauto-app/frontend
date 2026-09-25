export const MY_LISTINGS_QUERY_KEY = ["my-listings"] as const;
export const BILLING_ME_QUERY_KEY = ["billing-me"] as const;
export const FEATURED_LISTING_OFFERS_QUERY_KEY = [
  "featured-listing-offers-catalog",
] as const;
export const VEHICLE_INSIGHTS_QUERY_KEY = ["vehicle-insights"] as const;

export const vehicleInsightsQueryKey = (vehicleId: string) =>
  [...VEHICLE_INSIGHTS_QUERY_KEY, vehicleId] as const;
