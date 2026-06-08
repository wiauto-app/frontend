export interface Lead {
  id: string;
  vehicle_id: string;
  name: string;
  email: string;
  phone: string | null;
  phone_code: string | null;
  message: string;
  profile_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone?: string;
  phone_code?: string;
  message: string;
  accepted_terms: boolean;
}

export interface CreateLeadResponse {
  lead: Lead;
  chat_id: string | null;
}
