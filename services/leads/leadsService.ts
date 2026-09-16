import { apiPost, type ApiResponse } from "@/lib/api";

export interface CreateLeadDto {
  type: string;
  first_name: string;
  last_name: string;
  dni?: string;
  phone: string;
  email: string;
  extra_data?: Record<string, unknown>;
}

export interface LeadResponse {
  id: string;
  type: string;
  status: string;
  created_at: string;
}

export const leadsService = {
  create: (data: CreateLeadDto): Promise<ApiResponse<LeadResponse>> =>
    apiPost<LeadResponse>("/v1/leads", data),
};
