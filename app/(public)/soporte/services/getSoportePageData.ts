import { getStrapiData } from "@/lib/strapi-api";
import qs from "qs";

import type {
  SoportePageData,
  StrapiSoporteResponse,
} from "../interfaces/soporte.interface";

const SOPORTE_POPULATE_QUERY = {
  populate: {
    hero: {
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
    },
    caracteristicas: {
      populate: {
        icon: true,
      },
    },
    canales: {
      populate: {
        header: true,
        channel: {
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
    },
    preguntas: {
      populate: {
        header: true,
        preguntas: true,
      },
    },
  },
};

/**
 * Contenido de la página de soporte desde Strapi (single type `soporte`).
 * Retorna `null` si no hay data; propaga errores de red/HTTP.
 */
export const getSoportePageData = async (): Promise<SoportePageData | null> => {
  const query = qs.stringify(SOPORTE_POPULATE_QUERY, {
    encodeValuesOnly: true,
  });

  const response = await getStrapiData<StrapiSoporteResponse>(
    `/soporte?${query}`,
  );

  return response.data ?? null;
};
