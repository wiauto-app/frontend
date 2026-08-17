import { getStrapiData } from "@/lib/strapi-api";
import qs from "qs";

import type { PlanesPageResponse, StrapiPlanesResponse } from "../interfaces/planes.interface";
import { HERO_POPULATE } from "@/lib/strapi-populate";

const PLANS_POPULATE_QUERY = {
  populate: {
    hero: HERO_POPULATE,

    estadisticas: true,
    action_call_section: HERO_POPULATE,
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
