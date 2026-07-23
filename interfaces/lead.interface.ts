export type LeadType = "contact" | "call_me";
export type LeadSort = "asc" | "desc";
export type LeadSortDirection = LeadSort;

export interface Lead {
  id: string;
  vehicle_id: string;
  type?: LeadType;
  name: string;
  email?: string | null;
  phone: string | null;
  phone_code: string | null;
  message?: string | null;
  callback_scheduled_at?: string | null;
  profile_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadVehicleSummary {
  id: string;
  title?: string | null;
  display_name?: string | null;
  image?: string | null;
  image_url?: string | null;
}

export interface LeadListItem extends Lead {
  vehicle: LeadVehicleSummary;
  buyer_profile_id: string | null;
}

export interface FindLeadsParams {
  from?: string;
  to?: string;
  sort?: LeadSort;
  page?: number;
  limit?: number;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone?: string;
  phone_code?: string;
  message: string;
  accepted_terms: boolean;
}

export interface CreateCallMePayload {
  name: string;
  phone: string;
  phone_code: string;
  callback_scheduled_at: string;
  accepted_terms: boolean;
}

export interface CreateLeadResponse {
  lead: Lead;
  chat_id: string | null;
}
