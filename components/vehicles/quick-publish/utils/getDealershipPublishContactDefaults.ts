import type { DealershipMembership } from "@/services/dealerships/types/team.types";

export interface DealershipPublishContactDefaults {
  phone_code: string;
  phone: string;
  lat?: number;
  lng?: number;
}

const isFiniteCoord = (value: number | null | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value);

/**
 * Teléfono y ubicación del concesionario (sesión) para precargar la publicación.
 * Prioriza membership frente al teléfono del perfil en `/me`.
 */
export const getDealershipPublishContactDefaults = (
  membership: DealershipMembership | null | undefined,
): DealershipPublishContactDefaults | null => {
  if (!membership) {
    return null;
  }

  const phone = membership.phone?.trim();
  const phoneCode = membership.phone_code?.trim();
  if (!phone || !phoneCode) {
    return null;
  }

  const defaults: DealershipPublishContactDefaults = {
    phone_code: phoneCode,
    phone,
  };

  if (isFiniteCoord(membership.lat) && isFiniteCoord(membership.lng)) {
    defaults.lat = membership.lat;
    defaults.lng = membership.lng;
  }

  return defaults;
};
