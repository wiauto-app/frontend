import { getStrapiData } from "@/lib/strapi-api";
import { mapHomePageData } from "../mappers/map-home-page-data";
import type { HomePageData } from "../types/home-page.types";
import type { StrapiHomepageResponse } from "../types/strapi-home.types";

const HOME_POPULATE_QUERY =
  "/homepage?populate[homeSeo][populate][shareImage]=true&populate[homeHero][populate][backgroundImage]=true&populate[homeHero][populate][actionLinks]=true&populate[homeAppAdvertisment][populate][appMockup]=true&populate[homeFeatures][populate][feature][populate][icon]=true&populate[homeNewsletter]=true";

export const getHomeData = async (): Promise<HomePageData> => {
  const response = await getStrapiData<StrapiHomepageResponse>(HOME_POPULATE_QUERY);
  return mapHomePageData(response);
};
