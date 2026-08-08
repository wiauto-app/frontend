import { getStrapiData } from "@/lib/strapi-api";
import qs from "qs";

import type {
  FinanciacionPageData,
  StrapiFinanciacionResponse,
} from "../interfaces/financiacion.interface";
import { ADVANTAGES_POPULATE, HERO_POPULATE, STEPS_POPULATE } from "@/lib/strapi-populate";


const FINANCIACION_POPULATE_QUERY = {
  populate: {
    hero: HERO_POPULATE,
    ventajas: ADVANTAGES_POPULATE,
    pasos: STEPS_POPULATE,
    soporte: HERO_POPULATE,
    estadisticas: true,
  },
};

/**
 * Contenido de la landing de financiación desde Strapi (single type `financiacion`).
 * Retorna `null` si no hay data; propaga errores de red/HTTP.
 */
export const getFinanciacionPageData =
  async (): Promise<FinanciacionPageData | null> => {
    const query = qs.stringify(FINANCIACION_POPULATE_QUERY, {
      encodeValuesOnly: true,
    });

    const response = await getStrapiData<StrapiFinanciacionResponse>(
      `/financiacion?${query}`,
    );

    return response.data ?? null;
  };
