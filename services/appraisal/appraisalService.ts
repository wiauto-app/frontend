import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";

import {
  V1_APPRAISALS,
  V1_APPRAISALS_ESTIMATE,
  V1_APPRAISALS_ME,
  V1_DEALERSHIP_APPRAISAL_OPPORTUNITIES,
} from "./route.constants";
import type {
  AppraisalDetail,
  AppraisalListItem,
  AppraisalOpportunitiesPage,
  AppraisalOpportunity,
  AppraisalOpportunityScope,
  EstimateAppraisalPayload,
  UpsertAppraisalOfferPayload,
} from "./types/appraisal.types";

/** Tasaciones del vendedor. */
export const appraisalService = {
  estimate: (payload: EstimateAppraisalPayload) =>
    apiPost<AppraisalDetail>(V1_APPRAISALS_ESTIMATE, payload),

  findAllMine: () => apiGet<AppraisalListItem[]>(V1_APPRAISALS_ME),

  findOne: (id: string) => apiGet<AppraisalDetail>(`${V1_APPRAISALS}/${id}`),

  requestOffers: (id: string) =>
    apiPost<AppraisalDetail>(`${V1_APPRAISALS}/${id}/request-offers`),

  acceptOffer: (id: string, offer_id: string) =>
    apiPost<AppraisalDetail>(`${V1_APPRAISALS}/${id}/offers/${offer_id}/accept`),

  rejectOffer: (id: string, offer_id: string) =>
    apiPost<AppraisalDetail>(`${V1_APPRAISALS}/${id}/offers/${offer_id}/reject`),
};

/** Tasaciones vistas por un concesionario (owner/admin). */
export const appraisalOpportunitiesService = {
  findAll: (params: { scope: AppraisalOpportunityScope; page?: number; limit?: number }) =>
    apiGet<AppraisalOpportunitiesPage>(V1_DEALERSHIP_APPRAISAL_OPPORTUNITIES, params),

  findOne: (id: string) =>
    apiGet<AppraisalOpportunity>(`${V1_DEALERSHIP_APPRAISAL_OPPORTUNITIES}/${id}`),

  upsertOffer: (id: string, payload: UpsertAppraisalOfferPayload) =>
    apiPut<AppraisalOpportunity>(
      `${V1_DEALERSHIP_APPRAISAL_OPPORTUNITIES}/${id}/offer`,
      payload,
    ),

  withdrawOffer: (id: string) =>
    apiDelete<AppraisalOpportunity>(`${V1_DEALERSHIP_APPRAISAL_OPPORTUNITIES}/${id}/offer`),
};
