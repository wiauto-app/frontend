import qs from "qs";

import { buildVehicleListingHref } from "./build-listing-url";
import { VEHICLES_LISTING_BASE_PATH } from "./constants";
import { FILTERS_QS_STRINGIFY_OPTIONS } from "./filters-query";
import { parseVehicleListingUrl } from "./parse-listing-url";

/** Claves de paginación: una búsqueda reabierta siempre empieza en la página 1. */
const PAGINATION_KEYS = new Set(["page", "limit"]);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Convierte un `query` crudo de GET /v1/vehicles (claves DTO de la API, p. ej.
 * el guardado en el historial de búsquedas) en la URL amigable del listado.
 *
 * Reutiliza el pipeline del listado: se serializa como query legacy de la API,
 * `parseVehicleListingUrl` lo normaliza (tipos, arrays en coma, validaciones) y
 * `buildVehicleListingHref` genera path + query amigables. Las claves que el
 * listado no conoce se descartan sin romper la navegación.
 */
export const buildListingHrefFromApiQuery = (query: unknown): string => {
  if (!isPlainObject(query)) {
    return VEHICLES_LISTING_BASE_PATH;
  }

  const filtered = Object.fromEntries(
    Object.entries(query).filter(([key]) => !PAGINATION_KEYS.has(key)),
  );

  try {
    const search = new URLSearchParams(
      qs.stringify(filtered, FILTERS_QS_STRINGIFY_OPTIONS),
    );
    const params = parseVehicleListingUrl(undefined, search);
    return buildVehicleListingHref(params);
  } catch {
    return VEHICLES_LISTING_BASE_PATH;
  }
};
