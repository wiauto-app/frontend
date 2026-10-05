import type { PaginatedResult } from "@/types/general.types";

export type AppraisalStatus =
  | "pending"
  | "answered"
  | "closed"
  | "estimated"
  | "open_for_offers"
  | "offer_accepted"
  | "expired";

export type AppraisalOfferStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "expired";

export type AppraisalConfidence = "high" | "medium" | "low";

export type AppraisalTransmissionType = "manual" | "automatic";

export interface AppraisalVehicleSummary {
  make_id: number;
  model_id: number;
  year_id: number;
  version_id: number | null;
  fuel_type_id: number | null;
  make_name: string;
  model_name: string;
  year: number;
  version_name: string | null;
  fuel_type_name: string | null;
  transmission_type: AppraisalTransmissionType;
  mileage: number;
  power: number | null;
  vehicle_label: string;
}

export interface AppraisalEstimate {
  recommended_price: number;
  range_min: number;
  range_max: number;
  explanation: string | null;
  confidence: AppraisalConfidence | null;
  source: "platform" | "ai" | null;
}

export interface AppraisalOfferDealership {
  id: string;
  name: string;
  slug: string;
  avatar_url: string | null;
}

export interface AppraisalOffer {
  id: string;
  amount: number;
  message: string | null;
  status: AppraisalOfferStatus;
  created_at: string;
  updated_at: string;
  dealership: AppraisalOfferDealership;
}

export interface AppraisalContact {
  name: string;
  email: string;
  phone_code: string;
  phone: string;
}

/** `GET /v1/appraisals/:id` y respuestas de las acciones del vendedor. */
export interface AppraisalDetail {
  id: string;
  status: AppraisalStatus;
  created_at: string;
  offers_requested_at: string | null;
  offers_expire_at: string | null;
  accepted_offer_id: string | null;
  vehicle: AppraisalVehicleSummary;
  estimate: AppraisalEstimate | null;
  contact: AppraisalContact;
  offers: AppraisalOffer[];
}

/** `GET /v1/appraisals/me` */
export interface AppraisalListItem {
  id: string;
  status: AppraisalStatus;
  created_at: string;
  offers_expire_at: string | null;
  vehicle: AppraisalVehicleSummary;
  estimate: AppraisalEstimate | null;
  offers_count: number;
  best_offer_amount: number | null;
}

/** Body de `POST /v1/appraisals/estimate`. */
export interface EstimateAppraisalPayload {
  version_id: number;
  transmission_type: AppraisalTransmissionType;
  mileage: number;
  power?: number;
  plate?: string;
  name: string;
  last_name?: string;
  email: string;
  phone_code: string;
  phone: string;
}

export interface AppraisalMyOffer {
  id: string;
  amount: number;
  message: string | null;
  status: AppraisalOfferStatus;
  updated_at: string;
}

/** Tasación vista por un concesionario. */
export interface AppraisalOpportunity {
  id: string;
  status: AppraisalStatus;
  created_at: string;
  offers_expire_at: string | null;
  vehicle: AppraisalVehicleSummary;
  estimate: AppraisalEstimate | null;
  offers_count: number;
  my_offer: AppraisalMyOffer | null;
  seller_contact: AppraisalContact | null;
}

export type AppraisalOpportunityScope = "open" | "mine";

export type AppraisalOpportunitiesPage = PaginatedResult<AppraisalOpportunity>;

export interface UpsertAppraisalOfferPayload {
  amount: number;
  message?: string;
}
