import { apiPost, type ApiResponse } from "@/lib/api";
import type {
  CreateCallMePayload,
  CreateLeadPayload,
  CreateLeadResponse,
} from "@/interfaces/lead.interface";

export const leadService = {
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
