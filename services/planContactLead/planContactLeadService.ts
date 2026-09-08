import { apiPost } from "@/lib/api";
import { V1_PUBLIC_BILLING_PLAN_CONTACT_LEADS } from "@/services/planContactLead/route.constants";

export interface CreatePlanContactLeadPayload {
  phone: string;
  source: "planes";
}

export const planContactLeadService = {
  create: (payload: CreatePlanContactLeadPayload) =>
    apiPost<void>(V1_PUBLIC_BILLING_PLAN_CONTACT_LEADS, payload),
};
