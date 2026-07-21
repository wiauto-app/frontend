import { getStrapiData } from "@/lib/strapi-api";
import qs from "qs";

import type {
  SegurosPageData,
  StrapiSegurosResponse,
} from "../interfaces/seguros.interface";

const HERO_POPULATE = {
  populate: {
    acciones: {
      populate: {
        imagen: true,
      },
    },
    imagen: true,
    caracteristicas: {
      populate: {
        icon: true,
      },
    },
    card: {
      populate: {
        boton: {
          populate: {
            imagen: true,
          },
        },
        imagen: true,
      },
    },
  },
};

const FEATURES_SECTION_POPULATE = {
  populate: {
    feature: {
      populate: {
        icon: true,
      },
    },
  },
};

const SEGUROS_POPULATE_QUERY = {
  populate: {
    hero: HERO_POPULATE,
    caracteristicas: FEATURES_SECTION_POPULATE,
    seguridad: HERO_POPULATE,
    incluido: FEATURES_SECTION_POPULATE,
    aliados: FEATURES_SECTION_POPULATE,
  },
};

/**
 * Contenido de la landing de seguros desde Strapi (single type `seguro`).
 * Retorna `null` si no hay data; propaga errores de red/HTTP.
 */
export const getSegurosPageData = async (): Promise<SegurosPageData | null> => {
  const query = qs.stringify(SEGUROS_POPULATE_QUERY, {
    encodeValuesOnly: true,
  });

  const response = await getStrapiData<StrapiSegurosResponse>(
    `/seguro?${query}`,
  );

  return response.data ?? null;
};
