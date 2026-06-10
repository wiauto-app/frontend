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
};

export type CreateAlertFromVehiclePayload = {
  name?: string;
  phone?: string;
  phone_code?: string;
  email?: string;
};
