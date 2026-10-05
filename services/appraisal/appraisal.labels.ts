import type { AppraisalOfferStatus, AppraisalStatus } from "./types/appraisal.types";

export const APPRAISAL_STATUS_LABEL: Record<AppraisalStatus, string> = {
  pending: "Pendiente",
  answered: "Respondida",
  closed: "Cerrada",
  estimated: "Tasada",
  open_for_offers: "Recibiendo ofertas",
  offer_accepted: "Oferta aceptada",
  expired: "Vencida",
};

export const APPRAISAL_OFFER_STATUS_LABEL: Record<AppraisalOfferStatus, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  rejected: "Rechazada",
  withdrawn: "Retirada",
  expired: "Vencida",
};

export const TRANSMISSION_LABEL = {
  manual: "Manual",
  automatic: "Automático",
} as const;
