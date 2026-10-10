import type { StrapiCard } from "@/interfaces/strapi-components.interface";
import { getStrapiImageUrl } from "@/lib/strapi-media";

import {
  EXTRA_SERVICES_ACCENTS,
  EXTRA_SERVICES_CARDS_FALLBACK,
} from "./extraServicesCards.constants";
import type { ExtraServiceCardItem } from "./extraServicesCards.types";

const mapStrapiCardToExtraServiceCard = (
  card: StrapiCard,
  index: number,
): ExtraServiceCardItem | null => {
  const title = card.titulo?.trim();
  const href = card.boton?.url?.trim();

  if (!title || !href) {
    return null;
  }

  return {
    id: String(card.id ?? index),
    title,
    description: card.descripcion?.trim() ?? "",
    href,
    isExternal: Boolean(card.boton?.externo),
    imageUrl: getStrapiImageUrl(card.imagen, "large"),
    accentColor:
      card.colorTexto?.trim() ||
      EXTRA_SERVICES_ACCENTS[index % EXTRA_SERVICES_ACCENTS.length],
    backgroundColor: card.colorFondo?.trim() || null,
    iconName: card.iconName?.trim() || null,
  };
};

/** Normaliza `homepage.servicios_extra`; sin datos válidos devuelve el fallback legacy. */
export const mapExtraServicesCards = (
  cards: StrapiCard[] | null | undefined,
): ExtraServiceCardItem[] => {
  const mapped = (cards ?? [])
    .map(mapStrapiCardToExtraServiceCard)
    .filter((item): item is ExtraServiceCardItem => item !== null);

  return mapped.length > 0 ? mapped : EXTRA_SERVICES_CARDS_FALLBACK;
};
