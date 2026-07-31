import { apiPost } from "@/lib/api";
import type { PlanLeadCarsQuantity } from "@/app/(public)/planes/constants/cars-quantity.constants";
import { V1_PUBLIC_BILLING_PLAN_LEAD_REQUESTS } from "@/services/planLead/route.constants";

export interface CreatePlanLeadRequestPayload {
  name: string;
  email: string;
  phone: string;
  cars_quantity: PlanLeadCarsQuantity;
  message?: string;
}

export const planLeadService = {
  create: async (payload: CreatePlanLeadRequestPayload): Promise<void> => {
    await apiPost<void>(V1_PUBLIC_BILLING_PLAN_LEAD_REQUESTS, payload);
  },
};
