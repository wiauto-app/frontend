import { getStrapiData } from "@/lib/strapi-api";

import type {
  StrapiAboutUsEntry,
  StrapiAboutUsSingleResponse,
} from "../types/strapi-about-us.types";



export const aboutUsService = {
  findAll: async (): Promise<StrapiAboutUsEntry | null> => {
    const response = await getStrapiData<StrapiAboutUsSingleResponse>(
      "/sobre-nosotro?" +
      "populate[caracteristicas][populate]=icon" +
      "&populate[imagen]=true" +
      "&populate[businessCard][populate][caracteristicas][populate]=icon" +
      "&populate[equipo][populate][persona][populate]=imagen"
    );
    if (!response.data) {
      return null;
    }

    return response.data;
  },
};
