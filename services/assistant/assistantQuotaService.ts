import { apiGet, type ApiResponse } from "@/lib/api";
import type { AssistantQuotaResponse } from "@/interfaces/billing.interface";

const V1_ASSISTANT_QUOTA = "/v1/assistant/quota";

const unwrapResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.ok || response.data === null || response.data === undefined) {
    throw new Error(response.message || "Error al obtener la cuota del asistente");
  }

  return response.data;
};

export const assistantQuotaService = {
  getQuota: async (): Promise<AssistantQuotaResponse> => {
    const response = await apiGet<AssistantQuotaResponse>(V1_ASSISTANT_QUOTA);
    return unwrapResponse(response);
  },
};
