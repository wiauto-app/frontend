import { getStrapiData } from "@/lib/strapi-api";
import { mapFaqList } from "../mappers/map-faq";
import type { FaqItem } from "../types/faq.types";
import type { StrapiFaqListResponse } from "../types/strapi-faq.types";

export const getFaqData = async (): Promise<FaqItem[]> => {
  const response = await getStrapiData<StrapiFaqListResponse>(
    "/pregunta-frecuentes?sort=publishedAt:asc",
  );
  return mapFaqList(response);
};
