import { apiGet, apiPost, type ApiResponse } from "@/lib/api";
import type {
  CreateCallMePayload,
  CreateFinancingLeadPayload,
  CreateLeadPayload,
  CreateLeadResponse,
  FindLeadsParams,
  FindLeadsResult,
  LeadListItem,
} from "@/interfaces/lead.interface";

export const LEADS_QUERY_KEY = ["leads"] as const;

export const leadService = {
  findAll: (params?: FindLeadsParams): Promise<ApiResponse<FindLeadsResult>> =>
    apiGet<FindLeadsResult>("/v1/leads", {
      from: params?.from,
      to: params?.to,
      sort: params?.sort ?? "desc",
      sort_by: params?.sort_by ?? "date",
      tier: params?.tier,
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
    }),

  create: (
    vehicleId: string,
    payload: CreateLeadPayload,
  ): Promise<ApiResponse<CreateLeadResponse>> =>
    apiPost<CreateLeadResponse>(`/v1/vehicles/${vehicleId}/leads`, payload),

  createFinancing: (
    vehicleId: string,
    payload: CreateFinancingLeadPayload,
  ): Promise<ApiResponse<CreateLeadResponse>> =>
    apiPost<CreateLeadResponse>(
      `/v1/vehicles/${vehicleId}/leads/financing`,
      payload,
    ),

  createCallMe: (
    vehicleId: string,
    payload: CreateCallMePayload,
  ): Promise<ApiResponse<CreateLeadResponse>> =>
    apiPost<CreateLeadResponse>(
      `/v1/vehicles/${vehicleId}/leads/call-me`,
      payload,
    ),
};

export type { LeadListItem };
