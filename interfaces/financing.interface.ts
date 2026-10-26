/** Condiciones de financiación del concesionario (`GET /v1/financing/settings`). */
export interface DealershipFinancingSettings {
  dealership_id: string;
  /** `false` si el concesionario aún no ha guardado condiciones. */
  configured: boolean;
  enabled: boolean;
  financial_entity: string | null;
  tin: number;
  declared_tae: number | null;
  min_term_months: number;
  max_term_months: number;
  default_term_months: number;
  default_down_payment_percent: number;
  min_down_payment_percent: number;
  max_down_payment_percent: number;
  min_financeable_amount: number;
  opening_fee_percent: number;
  opening_fee_fixed: number | null;
  other_conditions: string | null;
}

export interface PatchDealershipFinancingSettingsPayload {
  enabled?: boolean;
  financial_entity?: string | null;
  tin?: number;
  declared_tae?: number | null;
  min_term_months?: number;
  max_term_months?: number;
  default_term_months?: number;
  default_down_payment_percent?: number;
  min_down_payment_percent?: number;
  max_down_payment_percent?: number;
  min_financeable_amount?: number;
  opening_fee_percent?: number;
  opening_fee_fixed?: number | null;
  other_conditions?: string | null;
}

/** Cuota «desde» en listados públicos. */
export interface VehicleFinancingOfferSummary {
  monthly_from: number;
  down_payment_percent: number;
  term_months: number;
}

/** Oferta completa en la ficha del vehículo. */
export interface VehicleFinancingOffer extends VehicleFinancingOfferSummary {
  financial_entity: string | null;
  tin: number;
  declared_tae: number | null;
  min_term_months: number;
  max_term_months: number;
  default_term_months: number;
  default_down_payment_percent: number;
  min_down_payment_percent: number;
  max_down_payment_percent: number;
  min_financeable_amount: number;
  opening_fee_percent: number;
  opening_fee_fixed: number | null;
  other_conditions: string | null;
  legal_notice: string;
}

export interface VehicleFinancingQuote {
  vehicle_id: string;
  price: number;
  down_payment_percent: number;
  down_payment: number;
  term_months: number;
  financeable_amount: number;
  opening_fee: number;
  opening_fee_percent: number;
  opening_fee_fixed: number | null;
  monthly_payment: number;
  total_interest: number;
  total_payable: number;
  tin: number;
  declared_tae: number | null;
  financial_entity: string | null;
  other_conditions: string | null;
  legal_notice: string;
}

export interface QuoteVehicleFinancingPayload {
  down_payment_percent: number;
  term_months: number;
}

/** Snapshot guardado en el lead de tipo `financing`. */
export interface LeadFinancingSnapshot {
  price: number;
  down_payment_percent: number;
  down_payment: number;
  term_months: number;
  monthly_payment: number;
  total_interest: number;
  opening_fee: number;
  tin: number;
  declared_tae: number | null;
  financial_entity: string | null;
}
