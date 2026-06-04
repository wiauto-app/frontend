import type { StrapiListMeta } from "@/lib/strapi.types";
import type { StrapiBlock } from "./faq.types";

export type StrapiFaqEntry = {
  id: number;
  documentId: string;
  pregunta: string;
  respuesta: StrapiBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type StrapiFaqListResponse = {
  data: StrapiFaqEntry[];
  meta: StrapiListMeta;
};
