export const LEAD_TIER = {
  HOT: "hot",
  WARM: "warm",
  COLD: "cold",
} as const;

export type LeadTier = (typeof LEAD_TIER)[keyof typeof LEAD_TIER];

export const LEAD_SCORE_SIGNAL = {
  CALL_REQUESTED: "call_requested",
  APPOINTMENT: "appointment",
  FINANCING: "financing",
  PURCHASE_INTENT: "purchase_intent",
  TRADE_IN: "trade_in",
  AVAILABILITY: "availability",
  DETAILED_MESSAGE: "detailed_message",
  VERIFIED_ACCOUNT: "verified_account",
  PHONE_PROVIDED: "phone_provided",
  ENGAGED_CHAT: "engaged_chat",
  FAST_RESPONSE: "fast_response",
  REPEAT_INTEREST: "repeat_interest",
  AI_HOT: "ai_hot",
  LOW_DETAIL: "low_detail",
} as const;

export type LeadScoreSignal =
  (typeof LEAD_SCORE_SIGNAL)[keyof typeof LEAD_SCORE_SIGNAL];

export interface LeadTierUiMeta {
  label: string;
  stripeClass: string;
  badgeClass: string;
  chipClass: string;
}

export const LEAD_TIER_UI: Record<LeadTier, LeadTierUiMeta> = {
  hot: {
    label: "Muy interesado",
    stripeClass: "bg-red-500",
    badgeClass: "bg-red-50 text-red-800 ring-red-200",
    chipClass: "bg-red-50 text-red-800",
  },
  warm: {
    label: "Interesado",
    stripeClass: "bg-amber-500",
    badgeClass: "bg-amber-50 text-amber-900 ring-amber-200",
    chipClass: "bg-amber-50 text-amber-900",
  },
  cold: {
    label: "Curioso",
    stripeClass: "bg-slate-400",
    badgeClass: "bg-slate-100 text-slate-700 ring-slate-200",
    chipClass: "bg-slate-100 text-slate-700",
  },
};

export const LEAD_SCORE_SIGNAL_LABELS: Record<LeadScoreSignal, string> = {
  call_requested: "Pidió cita",
  appointment: "Pidió cita",
  financing: "Preguntó por financiación",
  purchase_intent: "Quiere reservar",
  trade_in: "Ofrece su coche como parte de pago",
  availability: "Preguntó disponibilidad",
  detailed_message: "Mensaje detallado",
  verified_account: "Cuenta verificada",
  phone_provided: "Dejó teléfono",
  engaged_chat: "Conversación activa",
  fast_response: "Respondió rápido",
  repeat_interest: "Interés repetido",
  ai_hot: "Lead caliente según la IA",
  low_detail: "Mensaje muy breve",
};

export const LEAD_TIER_FILTER_TABS: { value: LeadTier | "all"; label: string }[] =
  [
    { value: "all", label: "Todos" },
    { value: "hot", label: "Muy interesados" },
    { value: "warm", label: "Interesados" },
    { value: "cold", label: "Curiosos" },
  ];

export const getLeadSignalLabel = (signal: LeadScoreSignal): string =>
  LEAD_SCORE_SIGNAL_LABELS[signal] ?? signal.replaceAll("_", " ");
