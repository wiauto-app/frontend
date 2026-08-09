import { getStrapiData } from "@/lib/strapi-api";
import qs from "qs";

import type {
  FaqPageData,
  StrapiFaqPageResponse,
} from "../interfaces/faq.interface";

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

const SOPORTE_POPULATE = {
  populate: {
    boton: {
      populate: {
        imagen: true,
      },
    },
    imagen: true,
  },
};

const FAQ_POPULATE_QUERY = {
  populate: {
    hero: HERO_POPULATE,
    faqs: true,
    soporte: SOPORTE_POPULATE,
  },
};

/**
 * Contenido de la landing de preguntas frecuentes desde Strapi (single type `faq`).
 * Retorna `null` si no hay data; propaga errores de red/HTTP.
 */
export const getFaqPageData = async (): Promise<FaqPageData | null> => {
  const query = qs.stringify(FAQ_POPULATE_QUERY, {
    encodeValuesOnly: true,
  });

  const response = await getStrapiData<StrapiFaqPageResponse>(`/faq?${query}`);

  return response.data ?? null;
};
