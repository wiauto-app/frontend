import { getStrapiData } from "@/lib/strapi-api";
import qs from "qs";

import type {
  AboutUsPageData,
  StrapiAboutUsResponse,
} from "../interfaces/aboutUs.interface";
import { ADVANTAGES_POPULATE, HERO_POPULATE } from "@/lib/strapi-populate";

const ABOUT_US_POPULATE_QUERY = {
  populate: {
    hero: HERO_POPULATE,
    mission: HERO_POPULATE,
    caracteristicas: ADVANTAGES_POPULATE,
    personas: HERO_POPULATE,
  },
};

/**
 * Contenido de la landing "Sobre nosotros" desde Strapi (single type `sobre-nosotro`).
 * Retorna `null` si no hay data; propaga errores de red/HTTP.
 */
export const aboutUsService = {
  findAll: async (): Promise<AboutUsPageData | null> => {
    const query = qs.stringify(ABOUT_US_POPULATE_QUERY, {
      encodeValuesOnly: true,
    });

    const response = await getStrapiData<StrapiAboutUsResponse>(
      `/sobre-nosotro?${query}`,
    );

    return response.data ?? null;
  },
};
