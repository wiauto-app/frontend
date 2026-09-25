import { API_URL } from "@/constants";
import { readSessionTokensFromCookies } from "@/lib/ensure-session.server";
import type { VehicleInsights } from "@/interfaces/vehicle-insights.interface";
import { vehicleInsightsPath } from "./vehicle-insights.routes";

interface BackendEnvelope<T> {
  ok?: boolean;
  status?: number;
  message?: string;
  data?: T;
}

const buildApiUrl = (path: string): string => {
  const base = (API_URL ?? "").replace(/\/$/, "");
  return `${base}${path}`;
};

const LOG_PREFIX = "[getVehicleInsights]";

/**
 * Lee los insights del anuncio en servidor con la sesión del usuario.
 * Devuelve `null` ante cualquier fallo (sin sesión, 403/404/5xx, red) pero lo
 * registra en el log del servidor: la página de éxito reintenta en cliente.
 */
export const getVehicleInsights = async (
  vehicleId: string,
): Promise<VehicleInsights | null> => {
  try {
    const { access_token } = await readSessionTokensFromCookies();
    if (!access_token) {
      console.warn(`${LOG_PREFIX} Sin access_token en sesión`, { vehicleId });
      return null;
    }

    const response = await fetch(buildApiUrl(vehicleInsightsPath(vehicleId)), {
      method: "GET",
      headers: { Authorization: `Bearer ${access_token}` },
      cache: "no-store",
    });

    const body = (await response
      .json()
      .catch(() => null)) as BackendEnvelope<VehicleInsights> | null;

    if (!response.ok) {
      console.error(`${LOG_PREFIX} Respuesta no OK del backend`, {
        vehicleId,
        status: response.status,
        message: body?.message ?? response.statusText,
      });
      return null;
    }

    if (!body?.data) {
      console.error(`${LOG_PREFIX} Respuesta sin datos`, {
        vehicleId,
        status: response.status,
        message: body?.message ?? null,
      });
      return null;
    }

    return body.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error al obtener insights`, {
      vehicleId,
      error,
    });
    return null;
  }
};
