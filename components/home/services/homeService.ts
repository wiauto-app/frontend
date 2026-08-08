import qs from "qs";

import { getStrapiData, type StrapiResponse } from "@/lib/strapi-api";
import { HERO_POPULATE } from "@/lib/strapi-populate";

import type { StrapiHomepageResponse } from "../types/strapi-home.types";

const HOME_POPULATE_QUERY = {
  populate: {
    homeSeo: {
      populate: {
        shareImage: true,
      },
    },
    homeHero: {
      populate: {
        caracteristicas: {
          populate: {
            icon: true,
          },
        },
        backgroundImage: true,
        heroImages: {
          populate: {
            image: true,
          },
        },
        actionLinks: true,
      },
    },
    promocion_planes: HERO_POPULATE,
    homeAppAdvertisment: {
      populate: {
        appMockup: true,
      },
    },
    homeFeatures: {
      populate: {
        feature: {
          populate: {
            icon: true,
          },
        },
      },
    },
    homeNewsletter: true,
    processSection: {
      populate: {
        tabs: {
          populate: {
            image: true,
          },
        },
      },
    },
    herramientas: {
      populate: {
        imagen: true,
        boton: true,
      },
    },
    bajas_emisiones: {
      populate: {
        header: true,
        imagen: true,
        links: {
          populate: {
            imagen: true,
            boton: true,
          },
        },
      },
    },
  },
};

export const getHomeData = async (): Promise<StrapiHomepageResponse> => {
  const query = qs.stringify(HOME_POPULATE_QUERY, {
    encodeValuesOnly: true,
  });
  const response = await getStrapiData<StrapiResponse<StrapiHomepageResponse>>(
    `/homepage?${query}`,
  );
  return response.data;
};
