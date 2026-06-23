import { API_URL } from "@/constants";
import { V1_PUBLIC_BILLING_PLAN_LEAD_REQUESTS } from "@/services/planLead/route.constants";

export type CreatePlanLeadRequestPayload = {
  name: string;
  email: string;
  phone: string;
  message?: string;
};

const buildApiUrl = (path: string): string => {
  if (!API_URL) {
    throw new Error("API_URL no configurada");
  }

  return `${API_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

export const planLeadService = {
  create: async (payload: CreatePlanLeadRequestPayload): Promise<void> => {
    const response = await fetch(buildApiUrl(V1_PUBLIC_BILLING_PLAN_LEAD_REQUESTS), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("No se pudo enviar la solicitud");
    }
  },
};
