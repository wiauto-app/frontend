import { getStrapiData } from "@/lib/strapi-api";
import qs from "qs";

import type { PlanesPageResponse, StrapiPlanesResponse } from "../interfaces/planes.interface";

const PLANS_POPULATE_QUERY = {
  populate: {
    hero: {
      populate: {
        acciones: true,
        imagen: true,
      },
    },

    estadisticas: true,

    caracteristicas: {
      populate: {
        header: true,
        caracteristicas: {
          populate: {
            icon: true,
          },
        },
      },
    },

    tech_add: {
      populate: {
        header: true,
        caracteristicas: {
          populate: {
            icon: true,
          },
        },
        imagen: true,
      },
    },

    mobile_advertisment: {
      populate: {
        header: true,
        imagen: true,
        apple: true,
        google: true,
        caracteristicas: {
          populate: {
            icon: true,
          },
        },
      },
    },
  },
};

export const getPlansData = async (): Promise<PlanesPageResponse | null> => {
  const query = qs.stringify(PLANS_POPULATE_QUERY, {
    encodeValuesOnly: true,
  });

  const response = await getStrapiData<StrapiPlanesResponse>(
    `/pagina-plan?${query}`,
  );

  return response.data ?? null;
};
