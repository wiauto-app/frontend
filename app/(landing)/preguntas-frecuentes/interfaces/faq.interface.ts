import type {
  StrapiCard,
  StrapiFaq,
  StrapiHero,
} from "@/interfaces/strapi-components.interface";

/** Single type `faq` */
export interface FaqPageData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  hero: StrapiHero ;
  faqs: StrapiFaq[] ;
  soporte: StrapiCard ;
}

export interface StrapiFaqPageResponse {
  data: FaqPageData ;
}
