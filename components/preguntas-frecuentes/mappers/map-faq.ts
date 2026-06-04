import type { FaqItem } from "../types/faq.types";
import type { StrapiFaqEntry, StrapiFaqListResponse } from "../types/strapi-faq.types";

const mapFaqItem = (entry: StrapiFaqEntry): FaqItem => ({
  id: entry.documentId,
  pregunta: entry.pregunta,
  respuesta: entry.respuesta ?? [],
});

export const mapFaqList = (response: StrapiFaqListResponse): FaqItem[] =>
  response.data.map(mapFaqItem);
