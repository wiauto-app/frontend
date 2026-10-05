import type { EstimateAppraisalPayload } from "@/services/appraisal/types/appraisal.types";

import type { TasadorFormValues } from "../schemas/tasador.schema";

const PENDING_KEY = "tasador:pending";
/** Una tasación pendiente vale 30 minutos (cubre la ida y vuelta de un login OAuth). */
const PENDING_TTL_MS = 30 * 60 * 1000;

interface PendingTasador {
  values: TasadorFormValues;
  saved_at: number;
}

export const savePendingTasador = (values: TasadorFormValues): void => {
  try {
    const pending: PendingTasador = { values, saved_at: Date.now() };
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  } catch {
    // sessionStorage no disponible (modo privado, etc.): el login por email sigue funcionando.
  }
};

export const readPendingTasador = (): TasadorFormValues | null => {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) {
      return null;
    }
    const pending = JSON.parse(raw) as PendingTasador;
    if (Date.now() - pending.saved_at > PENDING_TTL_MS) {
      sessionStorage.removeItem(PENDING_KEY);
      return null;
    }
    return pending.values;
  } catch {
    return null;
  }
};

export const clearPendingTasador = (): void => {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // Nada que limpiar.
  }
};

/** Valores del formulario → body de `POST /v1/appraisals/estimate`. */
export const toEstimatePayload = (values: TasadorFormValues): EstimateAppraisalPayload => ({
  version_id: values.version_id,
  transmission_type: values.transmission_type,
  mileage: values.mileage,
  power: values.power,
  plate: values.plate,
  name: values.name,
  last_name: values.last_name || undefined,
  email: values.email,
  phone_code: values.phone.phone_code,
  phone: values.phone.phone,
});
