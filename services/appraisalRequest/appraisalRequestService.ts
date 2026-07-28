import { apiPost } from "@/lib/api";

import {
  V1_APPRAISAL_REQUESTS,
  V1_APPRAISAL_REQUESTS_AUTHENTICATED,
} from "./route.constants";

export interface CreateAppraisalRequestPayload {
  make_id: number;
  model_id: number;
  year_id: number;
  version_id: number;
  fuel_type_id?: number;
  body_type_id?: number;
  transmission_type: "manual" | "automatic";
  mileage: number;
  lat: number;
  lng: number;
  name: string;
  email: string;
  phone_code: string;
  phone: string;
}

export const appraisalRequestService = {
  create: (payload: CreateAppraisalRequestPayload) =>
    apiPost<{ id: string }>(V1_APPRAISAL_REQUESTS, payload),

  createAuthenticated: (payload: CreateAppraisalRequestPayload) =>
    apiPost<{ id: string }>(V1_APPRAISAL_REQUESTS_AUTHENTICATED, payload),
};
