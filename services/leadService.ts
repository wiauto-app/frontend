import { apiGet, apiPost, type ApiResponse } from "@/lib/api";
import type {
  CreateCallMePayload,
  CreateLeadPayload,
  CreateLeadResponse,
  FindLeadsParams,
  LeadListItem,
} from "@/interfaces/lead.interface";
import type { PaginatedResult } from "@/types/general.types";

export const LEADS_QUERY_KEY = ["leads"] as const;

export const leadService = {
  findAll: (
    params?: FindLeadsParams,
  ): Promise<ApiResponse<PaginatedResult<LeadListItem>>> =>
    apiGet<PaginatedResult<LeadListItem>>("/v1/leads", {
      from: params?.from,
      to: params?.to,
      sort: params?.sort ?? "desc",
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
    }),

  create: (
    vehicleId: string,
    payload: CreateLeadPayload,
  ): Promise<ApiResponse<CreateLeadResponse>> =>
    apiPost<CreateLeadResponse>(`/v1/vehicles/${vehicleId}/leads`, payload),

  createCallMe: (
    vehicleId: string,
    payload: CreateCallMePayload,
  ): Promise<ApiResponse<CreateLeadResponse>> =>
    apiPost<CreateLeadResponse>(
      `/v1/vehicles/${vehicleId}/leads/call-me`,
      payload,
    ),
};
