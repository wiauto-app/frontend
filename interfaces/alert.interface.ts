export type AlertFilters = Record<string, unknown> & {
  source_vehicle_id?: string;
};

export type Alert = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  profile_id: string;
  email: string;
  phone: string;
  phone_code: string;
  filters: AlertFilters;
  last_sent_at: string | null;
  is_active: boolean;
  notify_new_listings: boolean;
  notify_price_drops: boolean;
  notify_sold_removed: boolean;
  notify_featured: boolean;
  notify_recently_updated: boolean;
  last_viewed_at: string | null;
  new_matches_count: number;
};

export type CreateAlertFromVehiclePayload = {
  name?: string;
  phone?: string;
  phone_code?: string;
  email?: string;
};

export type UpdateAlertPayload = Partial<{
  name: string;
  filters: AlertFilters;
  is_active: boolean;
  notify_new_listings: boolean;
  notify_price_drops: boolean;
  notify_sold_removed: boolean;
  notify_featured: boolean;
  notify_recently_updated: boolean;
}>;
