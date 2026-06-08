import { apiPost, type ApiResponse } from "@/lib/api";
import type {
  CreateLeadPayload,
  CreateLeadResponse,
} from "@/interfaces/lead.interface";

export const leadService = {
  create: (
    vehicleId: string,
    payload: CreateLeadPayload,
  ): Promise<ApiResponse<CreateLeadResponse>> =>
    apiPost<CreateLeadResponse>(`/v1/vehicles/${vehicleId}/leads`, payload),
};
